<?php

declare(strict_types=1);

use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('public page render passes shell and template data to the frontend renderer', function () {
    $author = User::factory()->create(['name' => 'VMU Editor']);

    $page = Page::factory()->for($author, 'author')->create([
        'title' => 'Giới thiệu VMU',
        'slug' => 'gioi-thieu-vmu',
        'status' => 'published',
        'template_key' => 'landing',
        'template_data' => ['heroVariant' => 'split'],
    ]);

    $headerMenu = NavigationMenu::factory()->create([
        'location' => 'header',
        'is_active' => true,
    ]);

    $parentItem = NavigationItem::factory()->for($headerMenu, 'menu')->create([
        'title' => 'Giới thiệu',
        'type' => 'page',
        'linkable_type' => Page::class,
        'linkable_id' => $page->getKey(),
        'parent_id' => null,
    ]);

    NavigationItem::factory()->for($headerMenu, 'menu')->create([
        'title' => 'Liên hệ',
        'type' => 'custom_url',
        'url' => '/lien-he',
        'parent_id' => $parentItem->getKey(),
        'sort_order' => 1,
    ]);

    $footerMenu = NavigationMenu::factory()->create([
        'location' => 'footer',
        'is_active' => true,
    ]);

    NavigationItem::factory()->for($footerMenu, 'menu')->create([
        'title' => 'Tuyển sinh',
        'type' => 'custom_url',
        'url' => '/tuyen-sinh',
    ]);

    $this->get('/pages/gioi-thieu-vmu')
        ->assertOk()
        ->assertInertia(fn (Assert $inertiaPage) => $inertiaPage
            ->component('public/show')
            ->where('type', 'page')
            ->where('data.title', 'Giới thiệu VMU')
            ->where('data.templateKey', 'landing')
            ->where('data.templateData.heroVariant', 'split')
            ->where('data.authorName', 'VMU Editor')
            ->where('headerMenu.0.slug', 'gioi-thieu-vmu')
            ->where('headerMenu.0.children.0.url', '/lien-he')
            ->where('footerMenu.0.title', 'Tuyển sinh')
        );
});

test('public post render exposes article data and hides unpublished posts', function () {
    $author = User::factory()->create(['name' => 'Nguyễn Văn A']);
    $reviewer = User::factory()->create(['name' => 'Biên tập viên']);
    $category = PostCategory::factory()->create([
        'name' => 'Tin tức',
        'slug' => 'tin-tuc',
    ]);

    $publishedPost = Post::factory()->for($author, 'author')->create([
        'title' => 'Thông báo tuyển sinh',
        'slug' => 'thong-bao-tuyen-sinh',
        'status' => 'published',
        'template_key' => 'announcement',
        'template_data' => ['ctaLabel' => 'Đăng ký ngay'],
        'reviewed_by_id' => $reviewer->getKey(),
        'reviewed_at' => now(),
    ]);
    $publishedPost->categories()->sync([$category->getKey()]);

    $draftPost = Post::factory()->create([
        'slug' => 'bai-viet-nhap',
        'status' => 'draft',
    ]);

    $this->get('/posts/thong-bao-tuyen-sinh')
        ->assertOk()
        ->assertInertia(fn (Assert $inertiaPage) => $inertiaPage
            ->component('public/show')
            ->where('type', 'post')
            ->where('data.title', 'Thông báo tuyển sinh')
            ->where('data.templateKey', 'announcement')
            ->where('data.templateData.ctaLabel', 'Đăng ký ngay')
            ->where('data.authorName', 'Nguyễn Văn A')
            ->where('data.reviewerName', 'Biên tập viên')
            ->where('data.categories.0.slug', 'tin-tuc')
        );

    $this->get('/posts/bai-viet-nhap')->assertNotFound();
});

test('public category render resolves display mode and only includes published posts', function () {
    $author = User::factory()->create(['name' => 'Tác giả chuyên mục']);

    $category = PostCategory::factory()->create([
        'name' => 'Nghiên cứu',
        'slug' => 'nghien-cuu',
        'display_mode' => 'hybrid',
        'archive_template_key' => 'archive-featured',
        'archive_template_data' => ['featuredLimit' => 1],
        'is_active' => true,
    ]);

    $publishedPost = Post::factory()->for($author, 'author')->create([
        'title' => 'Công bố khoa học',
        'slug' => 'cong-bo-khoa-hoc',
        'status' => 'published',
        'template_key' => 'research',
    ]);
    $publishedPost->categories()->sync([$category->getKey()]);

    $draftPost = Post::factory()->for($author, 'author')->create([
        'title' => 'Bản nháp nội bộ',
        'slug' => 'ban-nhap-noi-bo',
        'status' => 'draft',
    ]);
    $draftPost->categories()->sync([$category->getKey()]);

    $this->get('/categories/nghien-cuu')
        ->assertOk()
        ->assertInertia(fn (Assert $inertiaPage) => $inertiaPage
            ->component('public/show')
            ->where('type', 'category')
            ->where('data.name', 'Nghiên cứu')
            ->where('data.displayMode', 'hybrid')
            ->where('data.archiveTemplateKey', 'archive-featured')
            ->where('data.archiveTemplateData.featuredLimit', 1)
            ->has('data.posts', 1)
            ->where('data.posts.0.slug', 'cong-bo-khoa-hoc')
            ->where('data.posts.0.templateKey', 'research')
            ->where('data.posts.0.authorName', 'Tác giả chuyên mục')
        );
});
