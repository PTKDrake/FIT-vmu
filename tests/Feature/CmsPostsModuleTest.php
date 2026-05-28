<?php

use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
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
        'category_id' => $category->id,
    ]);
});

test('cms post can be updated by managers', function () {
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
        'category_id' => $category->id,
    ]);
});

test('cms post status can be updated/published by authorized publishers', function () {
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
    ]);
    expect($post->fresh()->published_at)->not->toBeNull();
});

test('cms post can be deleted by managers', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $post = Post::factory()->create();

    $this->actingAs($editor)
        ->delete("/cms/posts/{$post->id}")
        ->assertRedirect('/cms/posts');

    $this->assertDatabaseMissing('posts', [
        'id' => $post->id,
    ]);
});
