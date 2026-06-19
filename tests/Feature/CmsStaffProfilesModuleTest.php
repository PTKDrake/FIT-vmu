<?php

use App\Events\CmsContentChanged;
use App\Models\Media;
use App\Models\Position;
use App\Models\StaffProfile;
use App\Models\Unit;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('staff profile policies follow role permissions', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $staffUser = User::factory()->create();
    $staffUser->assignRole('staff');

    $anotherStaffUser = User::factory()->create();
    $anotherStaffUser->assignRole('staff');

    $student = User::factory()->create();
    $student->assignRole('student');

    $staffProfile = StaffProfile::factory()->create([
        'user_id' => $staffUser->id,
    ]);

    // viewAny
    expect($admin->can('viewAny', StaffProfile::class))->toBeTrue()
        ->and($editor->can('viewAny', StaffProfile::class))->toBeTrue()
        ->and($staffUser->can('viewAny', StaffProfile::class))->toBeTrue()
        ->and($student->can('viewAny', StaffProfile::class))->toBeFalse();

    // view
    expect($admin->can('view', $staffProfile))->toBeTrue()
        ->and($editor->can('view', $staffProfile))->toBeTrue()
        ->and($staffUser->can('view', $staffProfile))->toBeTrue()
        ->and($anotherStaffUser->can('view', $staffProfile))->toBeTrue();

    // create
    expect($admin->can('create', StaffProfile::class))->toBeTrue()
        ->and($editor->can('create', StaffProfile::class))->toBeTrue()
        ->and($staffUser->can('create', StaffProfile::class))->toBeFalse();

    // update
    expect($admin->can('update', $staffProfile))->toBeTrue()
        ->and($editor->can('update', $staffProfile))->toBeTrue()
        // Staff user can edit their own profile
        ->and($staffUser->can('update', $staffProfile))->toBeTrue()
        // But not another staff member's profile
        ->and($anotherStaffUser->can('update', $staffProfile))->toBeFalse();

    // delete
    expect($admin->can('delete', $staffProfile))->toBeTrue()
        ->and($editor->can('delete', $staffProfile))->toBeTrue()
        ->and($staffUser->can('delete', $staffProfile))->toBeFalse();
});

test('cms staff profiles index renders with pagination and search filters', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $profile1 = StaffProfile::factory()->create([
        'full_name' => 'Nguyễn Văn A',
        'slug' => 'nguyen-van-a',
        'is_public' => true,
    ]);

    $profile2 = StaffProfile::factory()->create([
        'full_name' => 'Trần Thị B',
        'slug' => 'tran-thi-b',
        'is_public' => false,
    ]);

    // Test active/public list search
    $this->actingAs($admin)
        ->get('/cms/staff-profiles?search=Nguyễn&status=public')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/staff-profiles/index')
            ->where('can.createStaffProfile', true)
            ->where('profiles.data.0.id', $profile1->id)
            ->where('profiles.data.0.fullName', 'Nguyễn Văn A')
            ->has('profiles.data', 1)
        );

    // Test private/hidden list search
    $this->actingAs($admin)
        ->get('/cms/staff-profiles?status=private')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/staff-profiles/index')
            ->where('profiles.data.0.id', $profile2->id)
            ->where('profiles.data.0.fullName', 'Trần Thị B')
            ->has('profiles.data', 1)
        );
});

test('admin/editor can access staff profile create page and persist new profile', function () {
    Event::fake([CmsContentChanged::class]);

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $eligibleUser = User::factory()->create([
        'name' => 'Lê Hoàng C',
        'email' => 'lehoangc@vmu.edu.vn',
    ]);

    $unit1 = Unit::factory()->create();
    $position1 = Position::factory()->create();

    $this->actingAs($admin)
        ->get('/cms/staff-profiles/create')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/staff-profiles/create')
            ->has('users')
            ->has('units')
            ->has('positions')
        );

    $response = $this->actingAs($admin)
        ->post('/cms/staff-profiles', [
            'user_id' => $eligibleUser->id,
            'academic_title' => 'TS.',
            'full_name' => 'Lê Hoàng C',
            'slug' => 'le-hoang-c',
            'email' => 'lehoangc@vmu.edu.vn',
            'phone' => '0912345678',
            'bio' => blockNoteJsonTest('Tiểu sử giảng viên Lê Hoàng C.'),
            'bio_format' => 'blocknote_json',
            'is_public' => true,
            'appointments' => [
                [
                    'unit_id' => $unit1->id,
                    'position_id' => $position1->id,
                    'start_date' => '2026-01-01',
                    'end_date' => null,
                    'note' => 'Quyết định số 456',
                ],
            ],
        ]);

    $profile = StaffProfile::query()->where('slug', 'le-hoang-c')->firstOrFail();

    $response->assertRedirect("/cms/staff-profiles/{$profile->id}");

    expect($profile->user_id)->toBe($eligibleUser->id)
        ->and($profile->academic_title)->toBe('TS.')
        ->and($profile->full_name)->toBe('Lê Hoàng C')
        ->and($profile->is_public)->toBeTrue()
        ->and($profile->appointments)->toHaveCount(1)
        ->and($profile->appointments->first()->unit_id)->toBe($unit1->id)
        ->and($profile->appointments->first()->position_id)->toBe($position1->id)
        ->and($profile->appointments->first()->note)->toBe('Quyết định số 456');

    Event::assertDispatchedTimes(CmsContentChanged::class, 1);
});

test('admin can create staff profile without user account and link it later', function () {
    Event::fake([CmsContentChanged::class]);

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $eligibleUser = User::factory()->create([
        'name' => 'Phạm Minh D',
        'email' => 'phamminhd@vmu.edu.vn',
    ]);

    $response = $this->actingAs($admin)
        ->post('/cms/staff-profiles', [
            'user_id' => null,
            'academic_title' => 'ThS.',
            'full_name' => 'Phạm Minh D',
            'slug' => 'pham-minh-d',
            'email' => 'phamminhd@vmu.edu.vn',
            'phone' => '0912345679',
            'bio' => blockNoteJsonTest('Tiểu sử giảng viên Phạm Minh D.'),
            'bio_format' => 'blocknote_json',
            'is_public' => false,
            'appointments' => [],
        ]);

    $profile = StaffProfile::query()->where('slug', 'pham-minh-d')->firstOrFail();

    $response->assertRedirect("/cms/staff-profiles/{$profile->id}");

    expect($profile->user_id)->toBeNull();

    $this->actingAs($admin)
        ->post("/cms/staff-profiles/{$profile->id}", [
            '_method' => 'patch',
            'user_id' => $eligibleUser->id,
            'academic_title' => 'ThS.',
            'full_name' => 'Phạm Minh D',
            'slug' => 'pham-minh-d',
            'email' => 'phamminhd@vmu.edu.vn',
            'phone' => '0912345679',
            'bio' => blockNoteJsonTest('Tiểu sử giảng viên Phạm Minh D.'),
            'bio_format' => 'blocknote_json',
            'is_public' => false,
            'appointments' => [],
        ])
        ->assertRedirect("/cms/staff-profiles/{$profile->id}");

    expect($profile->refresh()->user_id)->toBe($eligibleUser->id);

    Event::assertDispatchedTimes(CmsContentChanged::class, 2);
});

test('user can update their own profile and upload a new avatar', function () {
    Event::fake([CmsContentChanged::class]);

    Storage::fake('public');

    $staffUser = User::factory()->create();
    $staffUser->assignRole('staff');

    $profile = StaffProfile::factory()->create([
        'user_id' => $staffUser->id,
        'academic_title' => 'ThS.',
        'full_name' => 'Lê Hoàng C',
        'slug' => 'le-hoang-c',
    ]);

    $unit1 = Unit::factory()->create();
    $position1 = Position::factory()->create();

    $file = UploadedFile::fake()->image('avatar.jpg');

    $this->actingAs($staffUser)
        ->post("/cms/staff-profiles/{$profile->id}", [
            '_method' => 'patch',
            'academic_title' => 'TS.',
            'full_name' => 'Lê Hoàng C Cập Nhật',
            'slug' => 'le-hoang-c-cap-nhat',
            'email' => 'lehoangc-new@vmu.edu.vn',
            'phone' => '0988888888',
            'avatar_file' => $file,
            'bio' => blockNoteJsonTest('Đã cập nhật tiểu sử.'),
            'bio_format' => 'blocknote_json',
            'is_public' => true,
            'appointments' => [
                [
                    'unit_id' => $unit1->id,
                    'position_id' => $position1->id,
                    'start_date' => '2026-01-01',
                    'end_date' => null,
                    'note' => 'Quyết định bổ nhiệm mới',
                ],
            ],
        ])
        ->assertRedirect("/cms/staff-profiles/{$profile->id}");

    $profile->refresh();

    expect($profile->full_name)->toBe('Lê Hoàng C Cập Nhật')
        ->and($profile->academic_title)->toBe('TS.')
        ->and($profile->slug)->toBe('le-hoang-c-cap-nhat')
        ->and($profile->email)->toBe('lehoangc-new@vmu.edu.vn')
        ->and($profile->phone)->toBe('0988888888')
        ->and($profile->avatar_id)->not->toBeNull()
        ->and($profile->is_public)->toBeTrue()
        ->and($profile->appointments)->toHaveCount(1)
        ->and($profile->appointments->first()->unit_id)->toBe($unit1->id)
        ->and($profile->appointments->first()->position_id)->toBe($position1->id)
        ->and($profile->appointments->first()->note)->toBe('Quyết định bổ nhiệm mới');

    $media = Media::find($profile->avatar_id);
    expect($media)->not->toBeNull();
    Storage::disk('public')->assertExists($media->path);

    Event::assertDispatchedTimes(CmsContentChanged::class, 1);
});

test('staff user cannot update other staff member profiles', function () {
    $staffUser = User::factory()->create();
    $staffUser->assignRole('staff');

    $anotherStaffUser = User::factory()->create();
    $anotherStaffUser->assignRole('staff');

    $profile = StaffProfile::factory()->create([
        'user_id' => $anotherStaffUser->id,
        'full_name' => 'Trần Thị B',
        'slug' => 'tran-thi-b',
    ]);

    $this->actingAs($staffUser)
        ->post("/cms/staff-profiles/{$profile->id}", [
            '_method' => 'patch',
            'full_name' => 'Trần Thị B Cập Nhật',
            'slug' => 'tran-thi-b-cap-nhat',
            'bio_format' => 'blocknote_json',
            'is_public' => true,
        ])
        ->assertForbidden();
});

test('admin can delete a staff profile', function () {
    Event::fake([CmsContentChanged::class]);

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $profile = StaffProfile::factory()->create();

    $this->actingAs($admin)
        ->delete("/cms/staff-profiles/{$profile->id}")
        ->assertRedirect('/cms/staff-profiles');

    $this->assertDatabaseMissing('staff_profiles', [
        'id' => $profile->id,
    ]);

    Event::assertDispatchedTimes(CmsContentChanged::class, 1);
});

function blockNoteJsonTest(string $text): string
{
    return json_encode([
        [
            'id' => 'block-1',
            'type' => 'paragraph',
            'props' => [],
            'content' => [
                [
                    'type' => 'text',
                    'text' => $text,
                    'styles' => [],
                ],
            ],
            'children' => [],
        ],
    ], JSON_THROW_ON_ERROR);
}
