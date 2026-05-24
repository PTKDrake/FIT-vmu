<?php

declare(strict_types=1);

use App\Data\PostData;
use App\Http\Requests\Posts\PublishPostRequest;
use App\Http\Requests\Posts\StorePostRequest;
use App\Http\Requests\Posts\UpdatePostRequest;
use App\Models\Post;
use App\Models\User;
use Carbon\CarbonImmutable;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Validator;

test('store post request authorizes users with create posts permission and maps to dto', function (): void {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $request = StorePostRequest::create('/posts', 'POST', [
        'title' => 'VMUFit news',
        'slug' => 'vmufit-news',
        'excerpt' => 'Short excerpt',
        'content' => '{"type":"doc"}',
        'content_format' => 'blocknote_json',
        'status' => 'draft',
        'published_at' => '2026-05-25T08:00:00+07:00',
    ]);
    $request->setUserResolver(fn (): User => $editor);

    expect($request->authorize())->toBeTrue();

    $validator = Validator::make($request->all(), $request->rules());

    expect($validator->passes())->toBeTrue();

    $request->setContainer($this->app);
    $request->setRedirector($this->app->make('redirect'));
    $request->validateResolved();

    $dto = $request->toDto();

    expect($dto)->toBeInstanceOf(PostData::class)
        ->and($dto->authorId)->toBe($editor->id)
        ->and($dto->contentFormat)->toBe('blocknote_json')
        ->and($dto->publishedAt)->toEqual(CarbonImmutable::parse('2026-05-25T08:00:00+07:00'));
});

test('update post request ignores the current post slug and requires post update permission', function (): void {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $post = Post::factory()->create([
        'slug' => 'existing-post',
        'author_id' => $editor->id,
    ]);

    $request = UpdatePostRequest::create("/posts/{$post->id}", 'PUT', [
        'title' => $post->title,
        'slug' => 'existing-post',
        'excerpt' => $post->excerpt,
        'content' => $post->content,
        'content_format' => $post->content_format,
        'thumbnail_id' => $post->thumbnail_id,
        'status' => $post->status,
        'published_at' => $post->published_at?->toIso8601String(),
    ]);
    $request->setUserResolver(fn (): User => $editor);
    $request->setRouteResolver(fn (): Route => routeWithPost('PUT', '/posts/{post}', $post));

    expect($request->authorize())->toBeTrue();

    $validator = Validator::make($request->all(), $request->rules());

    expect($validator->passes())->toBeTrue();

    $request->setContainer($this->app);
    $request->setRedirector($this->app->make('redirect'));
    $request->validateResolved();

    expect($request->toDto()->id)->toBe($post->id);
});

test('store post request rejects invalid content format and duplicate slug', function (): void {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $existingPost = Post::factory()->create([
        'slug' => 'duplicate-slug',
    ]);

    $request = StorePostRequest::create('/posts', 'POST', [
        'title' => 'Another post',
        'slug' => $existingPost->slug,
        'content_format' => 'html',
        'status' => 'draft',
    ]);
    $request->setUserResolver(fn (): User => $editor);

    $validator = Validator::make($request->all(), $request->rules());

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('slug'))->toBeTrue()
        ->and($validator->errors()->has('content_format'))->toBeTrue();
});

test('publish post request requires publish permission and published payload', function (): void {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $post = Post::factory()->create([
        'status' => 'draft',
        'published_at' => null,
    ]);

    $request = PublishPostRequest::create("/posts/{$post->id}/publish", 'PATCH', [
        'status' => 'published',
        'published_at' => '2026-05-25T08:00:00+07:00',
    ]);
    $request->setUserResolver(fn (): User => $editor);
    $request->setRouteResolver(fn (): Route => routeWithPost('PATCH', '/posts/{post}/publish', $post));

    expect($request->authorize())->toBeTrue();

    $validator = Validator::make($request->all(), $request->rules());

    expect($validator->passes())->toBeTrue();

    $request->setContainer($this->app);
    $request->setRedirector($this->app->make('redirect'));
    $request->validateResolved();

    expect($request->toDto()->status)->toBe('published');
});

function routeWithPost(string $method, string $uri, Post $post): Route
{
    $request = Request::create(str_replace('{post}', (string) $post->id, $uri), $method);
    $route = new Route($method, $uri, fn () => null);

    $route->bind($request);
    $route->setParameter('post', $post);

    return $route;
}
