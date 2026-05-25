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

    $post = Post::factory()->create();

    expect(Gate::forUser($editor)->allows('viewAny', Post::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('view', $post))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('create', Post::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('update', $post))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('delete', $post))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('publish', $post))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('viewAny', Post::class))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('view', $post))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('create', Post::class))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('update', $post))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('delete', $post))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('publish', $post))->toBeFalse();
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

    $post = Post::factory()->create();

    expect(makeUpdatePostRequest([], $editor, $post)->authorize())->toBeTrue()
        ->and(makeUpdatePostRequest([], $staff, $post)->authorize())->toBeFalse()
        ->and(makePublishPostRequest([], $editor, $post)->authorize())->toBeTrue()
        ->and(makePublishPostRequest([], $staff, $post)->authorize())->toBeFalse();
});

test('store post request validates the expected payload', function () {
    $existingPost = Post::factory()->create(['slug' => 'existing-post']);

    $validData = [
        'title' => 'VMUFit launch update',
        'slug' => 'vmufit-launch-update',
        'excerpt' => 'Short summary',
        'content' => '{"type":"doc"}',
        'content_format' => 'blocknote_json',
        'thumbnail_id' => $existingPost->thumbnail_id,
        'status' => 'draft',
    ];

    expect(validateRequest(makeStorePostRequest($validData), $validData)->passes())->toBeTrue()
        ->and(validateRequest(makeStorePostRequest([
            ...$validData,
            'slug' => 'existing-post',
        ]), [
            ...$validData,
            'slug' => 'existing-post',
        ])->errors()->keys())->toContain('slug')
        ->and(validateRequest(makeStorePostRequest([
            ...$validData,
            'status' => 'published',
        ]), [
            ...$validData,
            'status' => 'published',
        ])->errors()->keys())->toContain('status')
        ->and(validateRequest(makeStorePostRequest([
            ...$validData,
            'thumbnail_id' => 999999,
        ]), [
            ...$validData,
            'thumbnail_id' => 999999,
        ])->errors()->keys())->toContain('thumbnail_id')
        ->and(validateRequest(makeStorePostRequest([
            ...$validData,
            'content' => '',
        ]), [
            ...$validData,
            'content' => '',
        ])->errors()->keys())->toContain('content');
});

test('update post request allows the current post slug and publish request restricts status values', function () {
    $post = Post::factory()->create(['slug' => 'keep-this-slug']);

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

    expect(validateRequest(makeUpdatePostRequest($updateData, null, $post), $updateData)->passes())->toBeTrue()
        ->and(validateRequest(makePublishPostRequest($publishData, null, $post), $publishData)->passes())->toBeTrue()
        ->and(validateRequest(makePublishPostRequest([
            'status' => 'draft',
        ], null, $post), [
            'status' => 'draft',
        ])->errors()->keys())->toContain('status');
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
