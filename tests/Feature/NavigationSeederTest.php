<?php

declare(strict_types=1);

use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use App\Models\PostCategory;
use Database\Seeders\NavigationSeeder;
use Database\Seeders\PostCategorySeeder;

test('navigation seeder creates the new main header navigation from post categories', function () {
    $this->seed(PostCategorySeeder::class);
    $this->seed(NavigationSeeder::class);

    $headerMenu = NavigationMenu::query()
        ->where('slug', 'header-chinh')
        ->firstOrFail();

    $footerMenu = NavigationMenu::query()
        ->where('slug', 'footer-chinh')
        ->firstOrFail();

    expect(NavigationMenu::query()->count())->toBe(2)
        ->and(NavigationItem::query()->count())->toBe(14)
        ->and(NavigationItem::query()
            ->where('menu_id', $headerMenu->getKey())
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->pluck('title')
            ->all())->toBe([
                'Đơn vị',
                'Chuyên ngành',
                'Tuyển sinh',
                'Tin tức',
                'Thông báo',
            ])
        ->and(NavigationItem::query()
            ->where('menu_id', $footerMenu->getKey())
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->pluck('title')
            ->all())->toBe([
                'Sinh viên',
                'Đào tạo',
                'Liên hệ',
                'Thông báo',
            ]);

    $tinTucItem = NavigationItem::query()
        ->where('menu_id', $headerMenu->getKey())
        ->where('title', 'Tin tức')
        ->firstOrFail();

    expect($tinTucItem->linkable_type)->toBe(PostCategory::class)
        ->and($tinTucItem->linkable?->slug)->toBe('tin-tuc')
        ->and($tinTucItem->children->pluck('title')->all())->toBe([
            'Sự kiện',
            'Nghiên cứu khoa học',
            'Tin đơn vị',
            'Hoạt động sinh viên',
            'Tuyển dụng',
        ]);

    $donViItem = NavigationItem::query()
        ->where('menu_id', $headerMenu->getKey())
        ->where('title', 'Đơn vị')
        ->firstOrFail();

    expect($donViItem->linkable_type)->toBe(PostCategory::class)
        ->and($donViItem->linkable?->slug)->toBe('don-vi')
        ->and($donViItem->children)->toHaveCount(0);
});
