<?php

use App\Models\Media;
use App\Models\Page;
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

test('post detail page returns related posts up to 4 and categories with postCount', function () {
    $category = PostCategory::factory()->create([
        'name' => 'Tin Tuc',
        'slug' => 'tin-tuc',
        'is_active' => true,
    ]);

    $post = Post::factory()->create([
        'title' => 'Main Post',
        'slug' => 'main-post',
        'status' => 'published',
        'visibility' => 'public',
    ]);
    $post->categories()->sync([$category->id]);

    // Create 5 related posts in the same category
    $relatedPosts = Post::factory()->count(5)->create([
        'status' => 'published',
        'visibility' => 'public',
    ]);
    foreach ($relatedPosts as $rPost) {
        $rPost->categories()->sync([$category->id]);
    }

    $this->get('/tin-tuc/main-post')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/post')
            ->has('relatedPosts', 4)
            ->where('dynamicData.categories', function ($categories) {
                $category = collect($categories)->firstWhere('slug', 'tin-tuc');

                return $category !== null && $category['postCount'] === 6;
            })
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

test('public puck page props include media map for media references', function () {
    $media = Media::factory()->create([
        'display_name' => 'hero.jpg',
        'mime_type' => 'image/jpeg',
        'path' => 'media/2026/06/hero.jpg',
    ]);

    Page::factory()->create([
        'title' => 'Media page',
        'slug' => 'media-page',
        'visibility' => 'public',
        'content' => json_encode([
            'root' => ['props' => []],
            'content' => [
                [
                    'type' => 'Image',
                    'props' => [
                        'imageUrl' => [
                            'mediaId' => $media->id,
                            'displayName' => 'cached.jpg',
                        ],
                    ],
                ],
            ],
        ], JSON_THROW_ON_ERROR),
    ]);

    $this->get('/media-page')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/page')
            ->where("dynamicData.media.{$media->id}.id", $media->id)
            ->where("dynamicData.media.{$media->id}.displayName", 'hero.jpg')
            ->where("dynamicData.media.{$media->id}.mimeType", 'image/jpeg')
        );
});

test('public puck post props include media map and ignore legacy image url strings', function () {
    $category = PostCategory::factory()->create([
        'slug' => 'media-posts',
        'is_active' => true,
    ]);
    $media = Media::factory()->create([
        'display_name' => 'card.jpg',
        'mime_type' => 'image/jpeg',
        'path' => 'media/2026/06/card.jpg',
    ]);

    $post = Post::factory()->create([
        'slug' => 'media-post',
        'status' => 'published',
        'visibility' => 'public',
        'content_format' => 'puck_json',
        'content' => json_encode([
            'root' => ['props' => []],
            'content' => [
                [
                    'type' => 'Card',
                    'props' => [
                        'imageUrl' => [
                            'mediaId' => $media->id,
                        ],
                    ],
                ],
                [
                    'type' => 'Image',
                    'props' => [
                        'imageUrl' => 'https://example.com/legacy.jpg',
                    ],
                ],
            ],
        ], JSON_THROW_ON_ERROR),
    ]);
    $post->categories()->sync([$category->id]);

    $this->get('/media-posts/media-post')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/post')
            ->where('post.contentFormat', 'puck_json')
            ->where("dynamicData.media.{$media->id}.id", $media->id)
            ->missing('dynamicData.media.0')
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

test('category page filters posts by search query q', function () {
    $category = PostCategory::factory()->create([
        'name' => 'Mon hoc',
        'slug' => 'mon-hoc',
        'is_active' => true,
    ]);

    $post1 = Post::factory()->create([
        'title' => 'Lap trinh PHP co ban',
        'status' => 'published',
        'visibility' => 'public',
        'published_at' => now(),
    ]);
    $post1->categories()->sync([$category->id]);

    $post2 = Post::factory()->create([
        'title' => 'Co so du lieu nang cao',
        'status' => 'published',
        'visibility' => 'public',
        'published_at' => now(),
    ]);
    $post2->categories()->sync([$category->id]);

    $this->get('/mon-hoc?q=PHP')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/post-category')
            ->has('posts.data', 1)
            ->where('posts.data.0.title', 'Lap trinh PHP co ban')
        );
});

test('category page sorts posts by oldest and latest', function () {
    $category = PostCategory::factory()->create([
        'name' => 'Tin tuc VMU',
        'slug' => 'tin-tuc-vmu',
        'is_active' => true,
    ]);

    $postOld = Post::factory()->create([
        'title' => 'Bai cu',
        'status' => 'published',
        'visibility' => 'public',
        'published_at' => now()->subDays(2),
    ]);
    $postOld->categories()->sync([$category->id]);

    $postNew = Post::factory()->create([
        'title' => 'Bai moi',
        'status' => 'published',
        'visibility' => 'public',
        'published_at' => now()->subDay(),
    ]);
    $postNew->categories()->sync([$category->id]);

    // Test sort=latest (default)
    $this->get('/tin-tuc-vmu')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/post-category')
            ->where('posts.data.0.title', 'Bai moi')
            ->where('posts.data.1.title', 'Bai cu')
        );

    // Test sort=oldest
    $this->get('/tin-tuc-vmu?sort=oldest')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/post-category')
            ->where('posts.data.0.title', 'Bai cu')
            ->where('posts.data.1.title', 'Bai moi')
        );
});
