<?php

use App\Events\CmsContentChanged;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Support\Facades\Event;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('cms posts index renders correct posts and filters for authorized users', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $category = PostCategory::factory()->create(['name' => 'Tin VMU', 'slug' => 'tin-vmu']);
    $post = Post::factory()->create([
        'title' => 'Bài viết mẫu VMU',
        'slug' => 'bai-viet-mau-vmu',
        'status' => 'draft',
        'author_id' => $editor->id,
    ]);
    $post->categories()->sync([$category->id]);

    $this->actingAs($editor)
        ->get('/cms/posts?categoryId='.$category->id)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/posts/index')
            ->where('can.managePosts', true)
            ->where('can.publishPosts', true)
            ->where('posts.data.0.id', $post->id)
            ->where('posts.data.0.title', 'Bài viết mẫu VMU')
            ->where('posts.data.0.categoryNames.0', 'Tin VMU')
            ->has('categoryOptions')
        );
});

test('cms post create page renders successfully', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $this->actingAs($editor)
        ->get('/cms/posts/create')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/posts/create')
            ->has('categories')
        );
});

test('cms post edit page renders successfully', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $category = PostCategory::factory()->create([
        'name' => 'Tin tức khoa học',
        'is_active' => true,
    ]);

    $post = Post::factory()->create();
    $post->categories()->sync([$category->id]);

    $this->actingAs($editor)
        ->get("/cms/posts/{$post->id}/edit")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/posts/edit')
            ->where('post.title', $post->title)
            ->where('post.category_ids.0', $category->id)
            ->has('categories')
        );
});

test('cms post edit page normalizes nullable fields for form inputs', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $post = Post::factory()->create([
        'excerpt' => null,
        'content' => null,
    ]);

    $this->actingAs($editor)
        ->get("/cms/posts/{$post->id}/edit")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/posts/edit')
            ->where('post.excerpt', '')
            ->where('post.content', '')
        );
});

test('cms post can be created by managers', function () {
    Event::fake([CmsContentChanged::class]);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $category = PostCategory::factory()->create();

    $payload = [
        'title' => 'Bài viết mới tinh',
        'slug' => 'bai-viet-moi-tinh',
        'category_ids' => [$category->id],
        'excerpt' => 'Excerpt of post',
        'content' => '{"blocks":[]}',
        'content_format' => 'blocknote_json',
        'visibility' => 'public',
        'status' => 'pending',
    ];

    $this->actingAs($editor)
        ->post('/cms/posts', $payload)
        ->assertRedirect('/cms/posts');

    $this->assertDatabaseHas('posts', [
        'title' => 'Bài viết mới tinh',
        'slug' => 'bai-viet-moi-tinh',
        'excerpt' => 'Excerpt of post',
        'author_id' => $editor->id,
        'status' => 'pending',
    ]);
    $this->assertDatabaseHas('post_post_category', [
        'post_id' => Post::query()->where('slug', 'bai-viet-moi-tinh')->value('id'),
        'post_category_id' => $category->id,
    ]);

    Event::assertDispatchedTimes(CmsContentChanged::class, 1);
    Event::assertDispatched(CmsContentChanged::class, function (CmsContentChanged $event): bool {
        return $event->resource === 'posts'
            && $event->action === 'created'
            && $event->title === 'Bài viết mới tinh';
    });
});

test('cms post can be updated by managers', function () {
    Event::fake([CmsContentChanged::class]);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $post = Post::factory()->create(['author_id' => $editor->id]);
    $category = PostCategory::factory()->create();

    $payload = [
        'title' => 'Tiêu đề cập nhật',
        'slug' => 'tieu-de-cap-nhat',
        'category_ids' => [$category->id],
        'excerpt' => 'Excerpt updated',
        'content' => '{"blocks":[{"type":"paragraph"}]}',
        'content_format' => 'blocknote_json',
        'visibility' => 'public',
        'status' => 'draft',
    ];

    $this->actingAs($editor)
        ->patch("/cms/posts/{$post->id}", $payload)
        ->assertRedirect('/cms/posts');

    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
        'title' => 'Tiêu đề cập nhật',
        'slug' => 'tieu-de-cap-nhat',
        'status' => 'draft',
        'content' => '{"blocks":[{"type":"paragraph"}]}',
    ]);
    $this->assertDatabaseHas('post_post_category', [
        'post_id' => $post->id,
        'post_category_id' => $category->id,
    ]);

    Event::assertDispatchedTimes(CmsContentChanged::class, 1);
    Event::assertDispatched(CmsContentChanged::class, function (CmsContentChanged $event): bool {
        return $event->resource === 'posts'
            && $event->action === 'updated'
            && $event->title === 'Tiêu đề cập nhật';
    });
});

test('cms post status can be updated/published by authorized publishers', function () {
    Event::fake([CmsContentChanged::class]);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $post = Post::factory()->create(['status' => 'pending']);

    $this->actingAs($editor)
        ->patch("/cms/posts/{$post->id}/publish", [
            'status' => 'published',
        ])
        ->assertRedirect('/cms/posts');

    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
        'status' => 'published',
        'reviewed_by_id' => $editor->id,
        'rejection_reason' => null,
    ]);
    expect($post->fresh()->published_at)->not->toBeNull()
        ->and($post->fresh()->reviewed_at)->not->toBeNull();

    Event::assertDispatchedTimes(CmsContentChanged::class, 1);
    Event::assertDispatched(CmsContentChanged::class, function (CmsContentChanged $event): bool {
        return $event->resource === 'posts'
            && $event->action === 'published'
            && $event->status === 'published';
    });
});

test('cms post can be rejected with a review reason by authorized publishers', function () {
    Event::fake([CmsContentChanged::class]);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $post = Post::factory()->create(['status' => 'pending']);

    $this->actingAs($editor)
        ->patch("/cms/posts/{$post->id}/publish", [
            'status' => 'rejected',
            'rejection_reason' => 'Nội dung cần bổ sung nguồn trích dẫn.',
        ])
        ->assertRedirect('/cms/posts');

    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
        'status' => 'rejected',
        'reviewed_by_id' => $editor->id,
        'rejection_reason' => 'Nội dung cần bổ sung nguồn trích dẫn.',
    ]);
    expect($post->fresh()->published_at)->toBeNull()
        ->and($post->fresh()->reviewed_at)->not->toBeNull();

    Event::assertDispatched(CmsContentChanged::class, function (CmsContentChanged $event): bool {
        return $event->resource === 'posts'
            && $event->action === 'rejected'
            && $event->status === 'rejected';
    });
});

test('cms post publish endpoint rejects invalid review transitions', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $draftPost = Post::factory()->create(['status' => 'draft']);
    $rejectedPost = Post::factory()->create(['status' => 'rejected']);

    $this->actingAs($editor)
        ->patch("/cms/posts/{$draftPost->id}/publish", [
            'status' => 'published',
        ])
        ->assertForbidden();

    $this->actingAs($editor)
        ->patch("/cms/posts/{$rejectedPost->id}/publish", [
            'status' => 'published',
        ])
        ->assertForbidden();
});

test('cms post reject endpoint requires a rejection reason', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $post = Post::factory()->create(['status' => 'pending']);

    $this->actingAs($editor)
        ->from('/cms/posts')
        ->patch("/cms/posts/{$post->id}/publish", [
            'status' => 'rejected',
        ])
        ->assertRedirect('/cms/posts')
        ->assertSessionHasErrors(['rejection_reason']);
});

test('cms post can be deleted by managers', function () {
    Event::fake([CmsContentChanged::class]);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $post = Post::factory()->create();
    $deletedPostTitle = $post->title;

    $this->actingAs($editor)
        ->delete("/cms/posts/{$post->id}")
        ->assertRedirect('/cms/posts');

    $this->assertDatabaseMissing('posts', [
        'id' => $post->id,
    ]);

    Event::assertDispatchedTimes(CmsContentChanged::class, 1);
    Event::assertDispatched(CmsContentChanged::class, function (CmsContentChanged $event) use ($deletedPostTitle): bool {
        return $event->resource === 'posts'
            && $event->action === 'deleted'
            && $event->title === $deletedPostTitle;
    });
});
