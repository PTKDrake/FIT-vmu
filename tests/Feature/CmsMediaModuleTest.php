<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Document;
use App\Models\Media;
use App\Models\Post;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('media policy follows permission checks', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $student = User::factory()->create();
    $student->assignRole('student');

    $media = Media::factory()->create();

    expect(Gate::forUser($editor)->allows('viewAny', Media::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('create', Media::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('update', $media))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('delete', $media))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('viewAny', Media::class))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('create', Media::class))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('update', $media))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('delete', $media))->toBeFalse()
        ->and(Gate::forUser($student)->allows('viewAny', Media::class))->toBeFalse()
        ->and(Gate::forUser($student)->allows('create', Media::class))->toBeFalse();
});

test('cms media index filters and paginates rows from backend props', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $matchingUploader = User::factory()->create([
        'name' => 'Tran Thi Upload',
    ]);

    $otherUploader = User::factory()->create([
        'name' => 'Nguyen Van Video',
    ]);

    Media::factory()->for($otherUploader, 'uploadedBy')->create([
        'original_name' => '01jvvideoasset.mp4',
        'display_name' => 'clip-gioi-thieu.mp4',
        'mime_type' => 'video/mp4',
        'path' => 'media/2026/04/01jvvideoasset.mp4',
        'created_at' => now()->subDays(40),
    ]);

    Post::factory()->for($editor, 'author')->create([
        'thumbnail_id' => Media::factory()->for($matchingUploader, 'uploadedBy')->create([
            'original_name' => '01jvbannerasset.jpg',
            'display_name' => 'banner-tuyen-sinh.jpg',
            'mime_type' => 'image/jpeg',
            'path' => 'media/2026/05/01jvbannerasset.jpg',
            'created_at' => now()->subDays(2),
        ])->getKey(),
    ]);

    foreach (range(1, 25) as $index) {
        Media::factory()->for($matchingUploader, 'uploadedBy')->create([
            'original_name' => sprintf('01jvheroasset%02d.jpg', $index),
            'display_name' => sprintf('hero-fit-%02d.jpg', $index),
            'mime_type' => 'image/jpeg',
            'path' => sprintf('media/2026/05/01jvheroasset%02d.jpg', $index),
            'created_at' => now()->subHours($index),
        ]);
    }

    $this->actingAs($editor);

    $this->get(sprintf(
        '/cms/media?search=hero-fit&type=image&uploadedBy=%d&date=30d&sort=display_name&direction=asc&page=2&perPage=24',
        $matchingUploader->getKey(),
    ))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/media/index')
            ->has('media.data', 1)
            ->where('media.data.0.displayName', 'hero-fit-25.jpg')
            ->where('media.data.0.kind', 'image')
            ->where('media.data.0.uploader.name', 'Tran Thi Upload')
            ->missing('media.data.0.disk')
            ->missing('media.data.0.path')
            ->where('media.meta.currentPage', 2)
            ->where('media.meta.lastPage', 2)
            ->where('media.meta.perPage', 24)
            ->where('media.meta.total', 25)
            ->has('media.filters.uploaders', 2)
        );
});

test('cms media inertia xhr response keeps collection data under props', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $uploader = User::factory()->create([
        'name' => 'Tran Thi Upload',
    ]);

    Media::factory()->for($uploader, 'uploadedBy')->create([
        'original_name' => '01jvheroasset.jpg',
        'display_name' => 'hero-fit.jpg',
        'mime_type' => 'image/jpeg',
        'path' => 'media/2026/05/01jvheroasset.jpg',
    ]);

    $version = app(HandleInertiaRequests::class)->version(request());

    $response = $this->actingAs($editor)
        ->withHeaders([
            'X-Inertia' => 'true',
            'X-Inertia-Version' => (string) $version,
            'X-Requested-With' => 'XMLHttpRequest',
        ])
        ->get('/cms/media?search=hero-fit');

    $response->assertOk()
        ->assertJsonPath('component', 'cms/media/index')
        ->assertJsonPath('props.media.data.0.displayName', 'hero-fit.jpg');

    expect($response->json('media'))->toBeNull();
});

test('authorized users can upload image audio and video media', function () {
    Storage::fake('public');

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $image = UploadedFile::fake()->image('hero-banner.jpg');
    $audio = UploadedFile::fake()->create('intro.mp3', 512, 'audio/mpeg');
    $video = UploadedFile::fake()->create('teaser.mp4', 1024, 'video/mp4');

    $this->actingAs($editor)
        ->post('/cms/media', [
            'files' => [$image, $audio, $video],
        ])
        ->assertRedirect('/cms/media');

    expect(Media::query()->count())->toBe(3);

    Media::query()->get()->each(function (Media $media): void {
        Storage::disk('public')->assertExists($media->path);
        expect($media->uploaded_by)->not->toBeNull()
            ->and($media->path)->toStartWith('media/')
            ->and(basename($media->path))->toBe($media->original_name)
            ->and($media->display_name)->not->toBe($media->original_name)
            ->and($media->disk)->toBe('public');
    });
});

test('media upload rejects non media files', function () {
    Storage::fake('public');

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $this->actingAs($editor)
        ->post('/cms/media', [
            'files' => [
                UploadedFile::fake()->create('de-cuong.pdf', 128, 'application/pdf'),
            ],
        ])
        ->assertSessionHasErrors(['files.0']);

    expect(Media::query()->count())->toBe(0);
});

test('delete media removes unused assets from storage and database', function () {
    Storage::fake('public');

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $media = Media::factory()->for($editor, 'uploadedBy')->create([
        'disk' => 'public',
        'path' => 'media/2026/05/01jvremovableasset.jpg',
        'mime_type' => 'image/jpeg',
        'original_name' => '01jvremovableasset.jpg',
        'display_name' => 'removable-banner.jpg',
    ]);

    Storage::disk('public')->put($media->path, 'binary-content');

    $this->actingAs($editor)
        ->delete("/cms/media/{$media->getKey()}")
        ->assertRedirect('/cms/media');

    expect(Media::query()->find($media->getKey()))->toBeNull();
    Storage::disk('public')->assertMissing($media->path);
});

test('authorized users can rename media while preserving the original extension', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $media = Media::factory()->for($editor, 'uploadedBy')->create([
        'original_name' => '01jvstoragehero.png',
        'display_name' => 'hero-banner.png',
        'mime_type' => 'image/png',
    ]);

    $this->actingAs($editor)
        ->patch("/cms/media/{$media->getKey()}/rename", [
            'name' => 'banner tuyển sinh mới',
        ])
        ->assertRedirect('/cms/media');

    expect($media->refresh()->display_name)->toBe('banner tuyển sinh mới.png')
        ->and($media->refresh()->original_name)->toBe('01jvstoragehero.png');
});

test('authorized users can duplicate media and storage files', function () {
    Storage::fake('public');

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $media = Media::factory()->for($editor, 'uploadedBy')->create([
        'disk' => 'public',
        'path' => 'media/2026/05/01jvheroasset.jpg',
        'mime_type' => 'image/jpeg',
        'original_name' => '01jvheroasset.jpg',
        'display_name' => 'hero-banner.jpg',
        'size' => 1024,
    ]);

    Storage::disk('public')->put($media->path, 'binary-content');

    $this->actingAs($editor)
        ->post("/cms/media/{$media->getKey()}/duplicate")
        ->assertRedirect('/cms/media');

    expect(Media::query()->count())->toBe(2);

    $duplicate = Media::query()
        ->whereKeyNot($media->getKey())
        ->sole();

    Storage::disk('public')->assertExists($duplicate->path);

    expect($duplicate->display_name)->toBe('hero-banner - Copy.jpg')
        ->and($duplicate->original_name)->not->toBe($media->original_name)
        ->and(basename($duplicate->path))->toBe($duplicate->original_name)
        ->and($duplicate->uploaded_by)->toBe($editor->getKey())
        ->and($duplicate->mime_type)->toBe($media->mime_type)
        ->and($duplicate->size)->toBe($media->size);
});

test('delete media is blocked when asset is already in use', function () {
    Storage::fake('public');

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $media = Media::factory()->for($editor, 'uploadedBy')->create([
        'disk' => 'public',
        'path' => 'media/2026/05/01jvinuseasset.jpg',
        'mime_type' => 'image/jpeg',
        'original_name' => '01jvinuseasset.jpg',
        'display_name' => 'in-use-banner.jpg',
    ]);

    Storage::disk('public')->put($media->path, 'binary-content');

    Post::factory()->for($editor, 'author')->create([
        'thumbnail_id' => $media->getKey(),
    ]);

    $this->actingAs($editor)
        ->delete("/cms/media/{$media->getKey()}")
        ->assertRedirect('/cms/media')
        ->assertSessionHas('type', 'error');

    expect(Media::query()->find($media->getKey()))->not->toBeNull();
    Storage::disk('public')->assertExists($media->path);
});

test('users without delete permission cannot remove media', function () {
    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $media = Media::factory()->create();

    $this->actingAs($staff)
        ->delete("/cms/media/{$media->getKey()}")
        ->assertForbidden();
});

test('users without update permission cannot rename media', function () {
    $student = User::factory()->create();
    $student->assignRole('student');

    $media = Media::factory()->create([
        'original_name' => '01jvstudentasset.jpg',
        'display_name' => 'hero-banner.jpg',
    ]);

    $this->actingAs($student)
        ->patch("/cms/media/{$media->getKey()}/rename", [
            'name' => 'banner-moi',
        ])
        ->assertForbidden();
});

test('media usage counts are exposed in the cms list payload', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $media = Media::factory()->for($editor, 'uploadedBy')->create([
        'original_name' => '01jvsharedasset.jpg',
        'display_name' => 'shared-banner.jpg',
        'mime_type' => 'image/jpeg',
    ]);

    Post::factory()->for($editor, 'author')->create([
        'thumbnail_id' => $media->getKey(),
    ]);

    Document::factory()->for($editor, 'owner')->create([
        'file_id' => $media->getKey(),
    ]);

    $this->actingAs($editor)
        ->get('/cms/media')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/media/index')
            ->where('media.data.0.usage.posts', 1)
            ->where('media.data.0.usage.documents', 1)
            ->where('media.data.0.usage.total', 2)
        );
});
