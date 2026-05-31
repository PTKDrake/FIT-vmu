<?php

use App\Http\Requests\PublishPostRequest;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('post policy abilities follow permission checks', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $pendingPost = Post::factory()->create(['status' => 'pending']);
    $draftPost = Post::factory()->create(['status' => 'draft']);

    expect(Gate::forUser($editor)->allows('viewAny', Post::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('view', $pendingPost))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('create', Post::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('update', $pendingPost))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('delete', $pendingPost))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('publish', $pendingPost))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('publish', $draftPost))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('viewAny', Post::class))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('view', $pendingPost))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('create', Post::class))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('update', $pendingPost))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('delete', $pendingPost))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('publish', $pendingPost))->toBeFalse();
});

test('store post request authorizes only users who can create posts', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    expect(makeStorePostRequest([], $editor)->authorize())->toBeTrue()
        ->and(makeStorePostRequest([], $staff)->authorize())->toBeFalse();
});

test('update and publish requests authorize against the target post policy', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $pendingPost = Post::factory()->create(['status' => 'pending']);
    $draftPost = Post::factory()->create(['status' => 'draft']);

    expect(makeUpdatePostRequest([], $editor, $pendingPost)->authorize())->toBeTrue()
        ->and(makeUpdatePostRequest([], $staff, $pendingPost)->authorize())->toBeFalse()
        ->and(makePublishPostRequest([], $editor, $pendingPost)->authorize())->toBeTrue()
        ->and(makePublishPostRequest([], $editor, $draftPost)->authorize())->toBeFalse()
        ->and(makePublishPostRequest([], $staff, $pendingPost)->authorize())->toBeFalse();
});

test('store post request validates the expected payload', function () {
    $existingPost = Post::factory()->create(['slug' => 'existing-post']);
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $validData = [
        'title' => 'VMUFit launch update',
        'slug' => 'vmufit-launch-update',
        'excerpt' => 'Short summary',
        'content' => '{"type":"doc"}',
        'content_format' => 'blocknote_json',
        'thumbnail_id' => $existingPost->thumbnail_id,
        'status' => 'draft',
    ];

    expect(validateRequest(makeStorePostRequest($validData, $editor), $validData)->passes())->toBeTrue()
        ->and(validateRequest(makeStorePostRequest([
            ...$validData,
            'slug' => 'existing-post',
        ], $editor), [
            ...$validData,
            'slug' => 'existing-post',
        ])->errors()->keys())->toContain('slug')
        ->and(validateRequest(makeStorePostRequest([
            ...$validData,
            'status' => 'published',
        ], $editor), [
            ...$validData,
            'status' => 'published',
        ])->errors()->keys())->toContain('status')
        ->and(validateRequest(makeStorePostRequest([
            ...$validData,
            'thumbnail_id' => 999999,
        ], $editor), [
            ...$validData,
            'thumbnail_id' => 999999,
        ])->errors()->keys())->toContain('thumbnail_id')
        ->and(validateRequest(makeStorePostRequest([
            ...$validData,
            'content' => '',
        ], $editor), [
            ...$validData,
            'content' => '',
        ])->errors()->keys())->toContain('content');
});

test('update post request allows the current post slug and publish request enforces review payload', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $post = Post::factory()->create([
        'slug' => 'keep-this-slug',
        'status' => 'pending',
    ]);

    $updateData = [
        'title' => 'Updated title',
        'slug' => 'keep-this-slug',
        'excerpt' => null,
        'content' => '{"type":"doc"}',
        'content_format' => 'blocknote_json',
        'thumbnail_id' => $post->thumbnail_id,
        'status' => 'pending',
    ];

    $publishData = [
        'status' => 'published',
        'published_at' => now()->toDateTimeString(),
    ];

    expect(validateRequest(makeUpdatePostRequest($updateData, $editor, $post), $updateData)->passes())->toBeTrue()
        ->and(validateRequest(makePublishPostRequest($publishData, $editor, $post), $publishData)->passes())->toBeTrue()
        ->and(validateRequest(makeUpdatePostRequest([
            ...$updateData,
            'status' => 'published',
        ], $editor, $post), [
            ...$updateData,
            'status' => 'published',
        ])->errors()->keys())->toContain('status')
        ->and(validateRequest(makePublishPostRequest([
            'status' => 'draft',
        ], $editor, $post), [
            'status' => 'draft',
        ])->errors()->keys())->toContain('status')
        ->and(validateRequest(makePublishPostRequest([
            'status' => 'rejected',
        ], $editor, $post), [
            'status' => 'rejected',
        ])->errors()->keys())->toContain('rejection_reason')
        ->and(validateRequest(makePublishPostRequest([
            'status' => 'rejected',
            'rejection_reason' => 'Thiếu nội dung cần thiết.',
        ], $editor, $post), [
            'status' => 'rejected',
            'rejection_reason' => 'Thiếu nội dung cần thiết.',
        ])->passes())->toBeTrue();
});

function makeStorePostRequest(array $data, ?User $user = null): StorePostRequest
{
    /** @var StorePostRequest $request */
    $request = StorePostRequest::create('/posts', 'POST', $data);
    $request->setUserResolver(static fn (): ?User => $user);

    return $request;
}

function makeUpdatePostRequest(array $data, ?User $user = null, ?Post $post = null): UpdatePostRequest
{
    /** @var UpdatePostRequest $request */
    $request = UpdatePostRequest::create('/posts/'.($post?->getKey() ?? 'post'), 'PUT', $data);
    $request->setUserResolver(static fn (): ?User => $user);
    $request->setRouteResolver(static fn (): object => routeWithPostParameter($post));

    return $request;
}

function makePublishPostRequest(array $data, ?User $user = null, ?Post $post = null): PublishPostRequest
{
    /** @var PublishPostRequest $request */
    $request = PublishPostRequest::create('/posts/'.($post?->getKey() ?? 'post').'/publish', 'PATCH', $data);
    $request->setUserResolver(static fn (): ?User => $user);
    $request->setRouteResolver(static fn (): object => routeWithPostParameter($post));

    return $request;
}

function routeWithPostParameter(?Post $post): object
{
    return new class($post)
    {
        public function __construct(private readonly ?Post $post) {}

        public function parameter(string $name, mixed $default = null): mixed
        {
            if ($name === 'post') {
                return $this->post ?? $default;
            }

            return $default;
        }
    };
}

function validateRequest(StorePostRequest|UpdatePostRequest|PublishPostRequest $request, array $data)
{
    return Validator::make($data, $request->rules());
}
