<?php

use App\Models\Post;
use App\Models\PostCategory;
use App\Models\SiteLayout;
use App\Models\SiteSetting;
use Inertia\Testing\AssertableInertia as Assert;

test('category page returns 200 with correct inertia component and props', function () {
    $category = PostCategory::factory()->create([
        'name' => 'Tin tuc khoa',
        'slug' => 'tin-tuc-khoa',
        'is_active' => true,
    ]);

    Post::factory()->count(2)->create([
        'status' => 'published',
        'visibility' => 'public',
    ])->each(fn (Post $post) => $post->categories()->sync([$category->id]));

    $this->get('/tin-tuc-khoa')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/post-category')
            ->where('category.name', 'Tin tuc khoa')
            ->where('category.slug', 'tin-tuc-khoa')
            ->has('posts.data', 2)
            ->has('breadcrumbs')
        );
});

test('inactive category returns 404', function () {
    $category = PostCategory::factory()->create([
        'slug' => 'muc-khong-hoat-dong',
        'is_active' => false,
    ]);

    $this->get('/muc-khong-hoat-dong')
        ->assertNotFound();
});

test('parent category page includes posts from child categories', function () {
    $parent = PostCategory::factory()->create([
        'name' => 'Tin tuc tong hop',
        'slug' => 'tin-tuc-tong-hop',
        'is_active' => true,
        'parent_id' => null,
    ]);

    $child = PostCategory::factory()->create([
        'name' => 'Tin tuc con',
        'slug' => 'tin-tuc-con',
        'is_active' => true,
        'parent_id' => $parent->id,
    ]);

    Post::factory()->create([
        'status' => 'published',
        'visibility' => 'public',
    ])->categories()->sync([$child->id]);

    $this->get('/tin-tuc-tong-hop')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/post-category')
            ->has('posts.data', 1)
        );
});

test('post detail page returns 200 with correct inertia component', function () {
    $category = PostCategory::factory()->create([
        'slug' => 'thong-bao',
        'is_active' => true,
    ]);

    $post = Post::factory()->create([
        'title' => 'Bai viet thu nghiem',
        'slug' => 'bai-viet-thu-nghiem',
        'status' => 'published',
        'visibility' => 'public',
        'content_format' => 'blocknote_json',
    ]);
    $post->categories()->sync([$category->id]);

    $this->get('/thong-bao/bai-viet-thu-nghiem')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/post')
            ->where('post.title', 'Bai viet thu nghiem')
            ->where('post.slug', 'bai-viet-thu-nghiem')
            ->where('post.contentFormat', 'blocknote_json')
            ->has('breadcrumbs')
        );
});

test('draft post returns 404', function () {
    $category = PostCategory::factory()->create([
        'slug' => 'ban-tin-nhap',
        'is_active' => true,
    ]);

    $post = Post::factory()->create([
        'slug' => 'bai-viet-nhap',
        'status' => 'draft',
        'visibility' => 'public',
    ]);
    $post->categories()->sync([$category->id]);

    $this->get('/ban-tin-nhap/bai-viet-nhap')
        ->assertNotFound();
});

test('post not attached to url category returns 404', function () {
    $category1 = PostCategory::factory()->create([
        'slug' => 'muc-mot',
        'is_active' => true,
    ]);

    $category2 = PostCategory::factory()->create([
        'slug' => 'muc-hai',
        'is_active' => true,
    ]);

    $post = Post::factory()->create([
        'slug' => 'bai-thuoc-muc-hai',
        'status' => 'published',
        'visibility' => 'public',
    ]);
    $post->categories()->sync([$category2->id]);

    $this->get('/muc-mot/bai-thuoc-muc-hai')
        ->assertNotFound();
});

test('puck json post renders with correct content format', function () {
    $category = PostCategory::factory()->create([
        'slug' => 'trang-puck',
        'is_active' => true,
    ]);

    $puckContent = json_encode([
        'root' => ['props' => []],
        'content' => [['type' => 'HeadingBlock', 'props' => ['text' => 'Hello']]],
        'zones' => [],
    ], JSON_THROW_ON_ERROR);

    $post = Post::factory()->create([
        'slug' => 'bai-puck-json',
        'status' => 'published',
        'visibility' => 'public',
        'content_format' => 'puck_json',
        'content' => $puckContent,
    ]);
    $post->categories()->sync([$category->id]);

    $this->get('/trang-puck/bai-puck-json')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/post')
            ->where('post.contentFormat', 'puck_json')
        );
});

test('post with site_layout_id returns that layout and without falls back to default', function () {
    $postLayout = SiteLayout::factory()->create([
        'name' => 'Post Specific Layout',
    ]);

    $defaultLayout = SiteLayout::factory()->create([
        'name' => 'Default Post Layout',
    ]);

    SiteSetting::set(SiteSetting::KEY_DEFAULT_POST_LAYOUT, $defaultLayout->id);

    $category = PostCategory::factory()->create([
        'slug' => 'bo-cuc-bai-viet',
        'is_active' => true,
    ]);

    $postWithLayout = Post::factory()->create([
        'title' => 'Bai co layout rieng',
        'slug' => 'bai-co-layout-rieng',
        'status' => 'published',
        'visibility' => 'public',
        'site_layout_id' => $postLayout->id,
    ]);
    $postWithLayout->categories()->sync([$category->id]);

    $this->get('/bo-cuc-bai-viet/bai-co-layout-rieng')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/post')
            ->where('layout.id', $postLayout->id)
        );

    $postWithoutLayout = Post::factory()->create([
        'title' => 'Bai khong co layout',
        'slug' => 'bai-khong-co-layout',
        'status' => 'published',
        'visibility' => 'public',
        'site_layout_id' => null,
    ]);
    $postWithoutLayout->categories()->sync([$category->id]);

    $this->get('/bo-cuc-bai-viet/bai-khong-co-layout')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/post')
            ->where('layout.id', $defaultLayout->id)
        );
});
