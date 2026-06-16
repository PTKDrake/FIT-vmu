<?php

declare(strict_types=1);

use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use App\Models\Post;
use App\Models\PostCategory;
use Database\Seeders\DonViAndChuyenNganhSeeder;
use Database\Seeders\IntroPostsSeeder;
use Database\Seeders\NavigationSeeder;
use Database\Seeders\PostCategorySeeder;
use Database\Seeders\PostSeeder;
use Database\Seeders\RoleAndPermissionSeeder;

test('navigation seeder seeds a stable header and footer tree', function () {
    $this->seed(RoleAndPermissionSeeder::class);
    $this->seed(PostCategorySeeder::class);
    $this->seed(PostSeeder::class);
    $this->seed(IntroPostsSeeder::class);
    $this->seed(DonViAndChuyenNganhSeeder::class);

    $this->seed(NavigationSeeder::class);
    $this->seed(NavigationSeeder::class);

    $headerMenu = NavigationMenu::query()
        ->where('slug', 'header-chinh')
        ->firstOrFail();

    $footerMenu = NavigationMenu::query()
        ->where('slug', 'footer-chinh')
        ->firstOrFail();

    expect(NavigationMenu::query()->count())->toBe(2)
        ->and(NavigationItem::query()->count())->toBe(49)
        ->and(NavigationItem::query()
            ->where('menu_id', $headerMenu->getKey())
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->pluck('title')
            ->all())->toBe([
                'Trang chủ',
                'Đơn vị',
                'Chuyên ngành',
                'NCKH',
                'Tuyển sinh',
                'Tuyển dụng',
                'Tài liệu',
                'Cựu SV',
                'Tin tức',
                'Liên hệ',
                'Hoạt động cộng đồng',
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

    $donViItem = NavigationItem::query()
        ->where('menu_id', $headerMenu->getKey())
        ->where('title', 'Đơn vị')
        ->firstOrFail();

    $tinTucItem = NavigationItem::query()
        ->where('menu_id', $headerMenu->getKey())
        ->where('title', 'Tin tức')
        ->firstOrFail();

    $thongBaoItem = NavigationItem::query()
        ->where('menu_id', $footerMenu->getKey())
        ->where('title', 'Thông báo')
        ->firstOrFail();

    expect($donViItem->linkable_type)->toBe(PostCategory::class)
        ->and($donViItem->linkable?->slug)->toBe('don-vi')
        ->and($donViItem->children->pluck('title')->all())->toBe([
            'Ban chủ nhiệm khoa',
            'Bộ môn Hệ thống thông tin',
            'Bộ môn Khoa học máy tính',
            'Bộ môn Kỹ thuật máy tính',
            'Bộ môn Tin học đại cương',
            'Bộ môn Truyền thông và Mạng máy tính',
            'Ban chấp hành Công đoàn',
            'Liên chi đoàn Khoa CNTT',
        ]);

    $donViFirstChild = $donViItem->children->first();

    expect($donViFirstChild)->not->toBeNull()
        ->and($donViFirstChild->linkable_type)->toBe(Post::class)
        ->and($donViFirstChild->linkable?->slug)->toBe('don-vi-ban-chu-nhiem-khoa');

    $chuyenNganhItem = NavigationItem::query()
        ->where('menu_id', $headerMenu->getKey())
        ->where('title', 'Chuyên ngành')
        ->firstOrFail();

    expect($chuyenNganhItem->linkable_type)->toBe(PostCategory::class)
        ->and($chuyenNganhItem->linkable?->slug)->toBe('chuyen-nganh')
        ->and($chuyenNganhItem->children->pluck('title')->all())->toBe([
            'Công nghệ thông tin',
            'Công nghệ phần mềm',
            'Truyền thông và mạng máy tính',
        ]);

    expect($tinTucItem->linkable_type)->toBe(PostCategory::class)
        ->and($tinTucItem->linkable?->slug)->toBe('tin-don-vi')
        ->and($tinTucItem->children->pluck('title')->all())->toBe([
            'Cao học',
            'Thông báo',
            'Thời khóa biểu',
            'Tin đơn vị',
            'Kết nối doanh nghiệp',
            'Đoàn thanh niên',
            'Câu lạc bộ tin học',
            'Câu lạc bộ nghiên cứu khoa học',
            'Hoạt động thể thao văn nghệ',
            'Học bổng',
            'Cơ hội việc làm',
        ]);

    expect($thongBaoItem->linkable_type)->toBe(PostCategory::class)
        ->and($thongBaoItem->linkable?->slug)->toBe('thong-bao');

    $seededPost = Post::query()
        ->where('slug', 'gioi-thieu-khoa-cong-nghe-thong-tin')
        ->firstOrFail();

    /** @var array{
     *     root: array{props: array{title: string}},
     *     content: list<array{id: string, type: string, props: array{id: string}}>,
     *     zones: array<string, mixed>
     * } $postContent
     */
    $postContent = json_decode($seededPost->content ?? '', true, flags: JSON_THROW_ON_ERROR);

    expect(Post::query()->whereIn('slug', [
        'gioi-thieu-khoa-cong-nghe-thong-tin',
        'su-menh-va-tam-nhin',
        'co-cau-to-chuc',
    ])->count())->toBe(3)
        ->and($seededPost->content_format)->toBe('puck_json')
        ->and($postContent['root']['props']['title'])->toBe('Giới thiệu Khoa Công nghệ thông tin')
        ->and(collect($postContent['content'])->pluck('type')->all())->toBe([
            'Container',
            'Container',
            'Container',
        ])
        ->and(collect($postContent['content'])->pluck('props.id')->all())->toBe([
            'gioi-thieu-khoa-cong-nghe-thong-tin-hero-container',
            'gioi-thieu-khoa-cong-nghe-thong-tin-content-container',
            'gioi-thieu-khoa-cong-nghe-thong-tin-cta-container',
        ])
        ->and(collect($postContent['content'])->pluck('id')->all())->toBe([
            'gioi-thieu-khoa-cong-nghe-thong-tin-hero-container',
            'gioi-thieu-khoa-cong-nghe-thong-tin-content-container',
            'gioi-thieu-khoa-cong-nghe-thong-tin-cta-container',
        ])
        ->and(collect($postContent['content'])->pluck('props.id')->every(
            fn (mixed $id): bool => is_string($id) && $id !== '',
        ))->toBeTrue()
        ->and(allBlocksHaveMatchingNodeIds($postContent['content']))->toBeTrue()
        ->and(allBlocksContainNoSectionTypes($postContent['content']))->toBeTrue()
        ->and($postContent['zones'])->toBe([]);
});

/**
 * @param  list<array<string, mixed>>  $blocks
 */
function allBlocksHaveMatchingNodeIds(array $blocks): bool
{
    foreach ($blocks as $block) {
        if (! is_array($block)) {
            return false;
        }

        $props = is_array($block['props'] ?? null) ? $block['props'] : [];
        $nodeId = $block['id'] ?? null;
        $propId = $props['id'] ?? null;

        if (! is_string($nodeId) || $nodeId === '' || $nodeId !== $propId) {
            return false;
        }

        foreach ($props as $value) {
            if (! isBlockList($value)) {
                continue;
            }

            if (! allBlocksHaveMatchingNodeIds($value)) {
                return false;
            }
        }
    }

    return true;
}

function isBlockList(mixed $value): bool
{
    if (! is_array($value) || ! array_is_list($value) || $value === []) {
        return false;
    }

    foreach ($value as $item) {
        if (! is_array($item) || ! is_string($item['type'] ?? null)) {
            return false;
        }
    }

    return true;
}

/**
 * @param  list<array<string, mixed>>  $blocks
 */
function allBlocksContainNoSectionTypes(array $blocks): bool
{
    foreach ($blocks as $block) {
        if (! is_array($block)) {
            return false;
        }

        $type = $block['type'] ?? null;

        if (! is_string($type) || str_contains($type, 'Section')) {
            return false;
        }

        $props = is_array($block['props'] ?? null) ? $block['props'] : [];

        foreach ($props as $value) {
            if (! isBlockList($value)) {
                continue;
            }

            if (! allBlocksContainNoSectionTypes($value)) {
                return false;
            }
        }
    }

    return true;
}
