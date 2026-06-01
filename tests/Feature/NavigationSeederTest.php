<?php

declare(strict_types=1);

use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use Database\Seeders\NavigationSeeder;
use Database\Seeders\PostCategorySeeder;
use Database\Seeders\PostSeeder;
use Database\Seeders\RoleAndPermissionSeeder;

test('navigation seeder seeds a stable header and footer tree', function () {
    $this->seed(RoleAndPermissionSeeder::class);
    $this->seed(PostCategorySeeder::class);
    $this->seed(PostSeeder::class);

    $this->seed(NavigationSeeder::class);
    $this->seed(NavigationSeeder::class);

    $headerMenu = NavigationMenu::query()
        ->where('slug', 'header-chinh')
        ->firstOrFail();

    $footerMenu = NavigationMenu::query()
        ->where('slug', 'footer-chinh')
        ->firstOrFail();

    expect(NavigationMenu::query()->count())->toBe(2)
        ->and(NavigationItem::query()->count())->toBe(12)
        ->and(NavigationItem::query()
            ->where('menu_id', $headerMenu->getKey())
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->pluck('title')
            ->all())->toBe([
                'Trang chủ',
                'Giới thiệu',
                'Tin tức',
                'Tuyển sinh',
                'Liên hệ',
            ])
        ->and(NavigationItem::query()
            ->where('menu_id', $footerMenu->getKey())
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->pluck('title')
            ->all())->toBe([
                'Sinh viên',
                'Đào tạo',
                'Bài viết nổi bật',
                'Thông báo',
            ]);

    $gioiThieuItem = NavigationItem::query()
        ->where('menu_id', $headerMenu->getKey())
        ->where('title', 'Giới thiệu')
        ->firstOrFail();

    $tinTucItem = NavigationItem::query()
        ->where('menu_id', $headerMenu->getKey())
        ->where('title', 'Tin tức')
        ->firstOrFail();

    $baiVietNoiBatItem = NavigationItem::query()
        ->where('menu_id', $footerMenu->getKey())
        ->where('title', 'Bài viết nổi bật')
        ->firstOrFail();

    expect($gioiThieuItem->linkable_type)->toBe(Page::class)
        ->and($gioiThieuItem->linkable?->slug)->toBe('gioi-thieu-vmu')
        ->and($gioiThieuItem->children->pluck('title')->all())->toBe([
            'Sứ mệnh và tầm nhìn',
            'Cơ cấu tổ chức',
        ])
        ->and($tinTucItem->linkable_type)->toBe(PostCategory::class)
        ->and($tinTucItem->linkable?->slug)->toBe('tin-tuc')
        ->and($tinTucItem->children->pluck('title')->all())->toBe([
            'Thông báo',
        ])
        ->and($baiVietNoiBatItem->linkable_type)->toBe(Post::class)
        ->and($baiVietNoiBatItem->linkable?->slug)->toBe('vmu-khai-truong-chuoi-hoat-dong-chao-don-tan-sinh-vien');

    $seededPage = Page::query()
        ->where('slug', 'gioi-thieu-vmu')
        ->firstOrFail();

    /** @var array{
     *     root: array{props: array{title: string}},
     *     content: list<array{type: string, props: array{id: string}}>,
     *     zones: array<string, mixed>
     * } $pageContent
     */
    $pageContent = json_decode($seededPage->content ?? '', true, flags: JSON_THROW_ON_ERROR);

    expect(Page::query()->whereIn('slug', [
        'gioi-thieu-vmu',
        'su-menh-va-tam-nhin',
        'co-cau-to-chuc',
    ])->count())->toBe(3)
        ->and($seededPage->content_format)->toBe('puck_json')
        ->and($pageContent['root']['props']['title'])->toBe('Giới thiệu VMU')
        ->and(collect($pageContent['content'])->pluck('type')->all())->toBe([
            'HeroBanner',
            'RichText',
            'CTASection',
        ])
        ->and(collect($pageContent['content'])->pluck('props.id')->all())->toBe([
            'gioi-thieu-vmu-hero',
            'gioi-thieu-vmu-rich-text',
            'gioi-thieu-vmu-cta',
        ])
        ->and($pageContent['zones'])->toBe([]);
});
