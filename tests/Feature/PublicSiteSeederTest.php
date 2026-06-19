<?php

declare(strict_types=1);

use App\Models\Page;
use App\Models\SiteLayout;
use Database\Seeders\DatabaseSeeder;

test('public site footer seed stays aligned with social and copyright block props', function () {
    $this->seed(DatabaseSeeder::class);

    $layout = SiteLayout::query()
        ->where('key', 'default-page-layout')
        ->firstOrFail();

    /** @var array{
     *     content: list<array{
     *         type: string,
     *         props: array<string, mixed>
     *     }>
     * } $footerContent
     */
    $footerContent = json_decode($layout->footer_data ?? '', true, flags: JSON_THROW_ON_ERROR);

    $fitFooterBlock = findSeededBlockByType($footerContent['content'], 'SiteFooter');

    expect($fitFooterBlock)->not->toBeNull()
        ->and($fitFooterBlock['props'])->toMatchArray([
            'showBrand' => true,
            'showContact' => true,
            'showQuickLinks' => true,
            'showSupportLinks' => true,
            'showSocialLinks' => true,
            'showCopyright' => true,
            'showLegalLinks' => true,
            'quickLinksMenuId' => '2',
            'className' => '',
        ])
        ->and($fitFooterBlock['props']['socialLinks'])->toBeArray()
        ->and($fitFooterBlock['props']['socialLinks'])->toHaveCount(3)
        ->and($fitFooterBlock['props']['socialLinks'][0])->toMatchArray([
            'platform' => 'facebook',
        ])
        ->and($fitFooterBlock['props']['socialLinks'][2])->toMatchArray([
            'platform' => 'email',
            'url' => 'mailto:fit@vimaru.edu.vn',
        ])
        ->and($fitFooterBlock['props']['legalLinks'])->toBeArray()
        ->and($fitFooterBlock['props']['legalLinks'])->toHaveCount(3)
        ->and($fitFooterBlock['props']['legalLinks'][0])->toMatchArray([
            'label' => 'Chính sách bảo mật',
        ])
        ->and($fitFooterBlock['props']['supportLinks'])->toBeArray()
        ->and($fitFooterBlock['props']['supportLinks'])->toHaveCount(4)
        ->and($fitFooterBlock['props'])->toMatchArray([
            'contactTitle' => 'Thông tin liên hệ',
            'siteName' => 'Khoa CNTT',
            'organizationName' => 'Trường Đại học Hàng hải Việt Nam',
        ]);
});

test('public site header seed is consolidated into the FIT navigation block', function () {
    $this->seed(DatabaseSeeder::class);

    $layout = SiteLayout::query()
        ->where('key', 'default-page-layout')
        ->firstOrFail();

    /** @var array{
     *     content: list<array{
     *         type: string,
     *         props: array<string, mixed>
     *     }>
     * } $headerContent
     */
    $headerContent = json_decode($layout->header_data ?? '', true, flags: JSON_THROW_ON_ERROR);

    $navigationBlock = findSeededBlockByType($headerContent['content'], 'SiteHeader');

    expect($navigationBlock)->not->toBeNull()
        ->and($navigationBlock['props'])->toMatchArray([
            'menuId' => '1',
            'logoAlt' => 'Logo Khoa CNTT',
            'siteName' => 'Khoa CNTT',
            'organizationName' => 'Trường Đại học Hàng hải Việt Nam',
            'searchHref' => '/search',
            'searchLabel' => 'Tìm kiếm',
            'loginLabel' => 'Đăng nhập',
            'profileLabel' => 'Tài khoản',
        ]);
});

test('default post layout seed provides the news-detail sidebar blocks', function () {
    $this->seed(DatabaseSeeder::class);

    $layout = SiteLayout::query()
        ->where('key', 'default-post-layout')
        ->firstOrFail();

    /** @var array{
     *     content: list<array{
     *         type: string,
     *         props: array<string, mixed>
     *     }>
     * } $rightContent
     */
    $rightContent = json_decode($layout->right_data ?? '', true, flags: JSON_THROW_ON_ERROR);

    expect(collect($rightContent['content'])->pluck('type')->all())->toBe([
        'Container',
    ]);

    $sidebarContainer = findSeededBlockByType($rightContent['content'], 'Container');
    $latestPostsBlock = findSeededBlockByType($rightContent['content'], 'PostFeed');
    $categoriesBlock = findSeededBlockByType($rightContent['content'], 'PostCategoryList');
    $quickLinksBlock = findSeededBlockByType($rightContent['content'], 'SidebarQuickLinks');
    $supportBlock = findSeededBlockByType($rightContent['content'], 'SidebarSupport');

    expect($sidebarContainer)->not->toBeNull()
        ->and($sidebarContainer['props'])->toMatchArray([
            'maxWidth' => 'full',
            'horizontalPadding' => 'md',
            'align' => 'left',
            'insetY' => 'md',
            'stackChildren' => true,
            'childGap' => 'lg',
            'stickyOnDesktop' => true,
            'stickyTop' => 'lg',
        ])
        ->and($sidebarContainer['props']['children'])->toHaveCount(4)
        ->and(collect($sidebarContainer['props']['children'])->pluck('type')->all())->toBe([
            'PostFeed',
            'PostCategoryList',
            'SidebarQuickLinks',
            'SidebarSupport',
        ])
        ->and($latestPostsBlock)->not->toBeNull()
        ->and($latestPostsBlock['props'])->toMatchArray([
            'title' => 'Bài viết mới nhất',
            'limit' => 4,
            'layout' => 'sidebar',
            'showCTA' => true,
        ])
        ->and($categoriesBlock)->not->toBeNull()
        ->and($categoriesBlock['props'])->toMatchArray([
            'title' => 'Danh mục',
            'limit' => 6,
            'layout' => 'sidebar',
        ])
        ->and($quickLinksBlock)->not->toBeNull()
        ->and($quickLinksBlock['props']['links'])->toHaveCount(4)
        ->and($quickLinksBlock['props']['links'][0])->toMatchArray([
            'label' => 'Tuyển sinh',
            'icon' => 'graduation',
        ])
        ->and($supportBlock)->not->toBeNull()
        ->and($supportBlock['props'])->toMatchArray([
            'title' => 'Cần hỗ trợ?',
            'buttonLabel' => 'Liên hệ ngay',
            'buttonHref' => '/lien-he',
        ])
        ->and(seedBlocksHaveIds($rightContent['content']))->toBeTrue()
        ->and(seedBlocksHaveMatchingNodeIds($rightContent['content']))->toBeTrue()
        ->and(seedBlocksContainNoSectionTypes($rightContent['content']))->toBeTrue();
});

test('homepage seed includes the custom CTA block in the homepage content stack', function () {
    $this->seed(DatabaseSeeder::class);

    $page = Page::query()
        ->where('slug', 'trang-chu-vmu')
        ->firstOrFail();

    /** @var array{
     *     content: list<array{
     *         type: string,
     *         props: array<string, mixed>
     *     }>
     * } $pageContent
     */
    $pageContent = json_decode($page->content ?? '', true, flags: JSON_THROW_ON_ERROR);

    $newsBlock = findSeededBlockByType($pageContent['content'], 'FeaturedNews');
    $announcementsBlock = findSeededBlockByType($pageContent['content'], 'FeaturedAnnouncements');
    $ctaBlock = findSeededBlockByType($pageContent['content'], 'EnrollmentCta');

    expect($newsBlock)->not->toBeNull()
        ->and($newsBlock['props'])->toMatchArray([
            'title' => 'Tin tức nổi bật',
            'viewAllHref' => '/posts',
            'limit' => 4,
        ])
        ->and($announcementsBlock)->not->toBeNull()
        ->and($announcementsBlock['props'])->toMatchArray([
            'title' => 'Thông báo mới nhất',
            'actionHref' => '/posts',
            'limit' => 4,
        ])
        ->and($ctaBlock)->not->toBeNull()
        ->and($ctaBlock['props'])->toMatchArray([
            'id' => 'EnrollmentCta-4db743f2-e5e9-4ac8-8c02-da529abe55c6',
            'badge' => 'Tuyển sinh 2025',
            'siteName' => 'Khoa CNTT',
            'primaryActionLabel' => 'Tìm hiểu tuyển sinh',
            'secondaryActionLabel' => 'Liên hệ tư vấn',
        ])
        ->and(seedBlocksContainNoSectionTypes($pageContent['content']))->toBeTrue()
        ->and($ctaBlock['props']['trustItems'])->toHaveCount(3)
        ->and($ctaBlock['props']['imageUrl'])->toMatchArray([
            'mediaId' => 32,
            'mimeType' => 'image/jpeg',
        ]);
});

/**
 * @param  list<array{
 *     type: string,
 *     props: array<string, mixed>
 * }>  $blocks
 * @return array{
 *     type: string,
 *     props: array<string, mixed>
 * }|null
 */
function findSeededBlockByType(array $blocks, string $type): ?array
{
    foreach ($blocks as $block) {
        if (($block['type'] ?? null) === $type) {
            return $block;
        }

        $props = $block['props'] ?? null;

        if (! is_array($props)) {
            continue;
        }

        foreach ($props as $value) {
            if (! isSeededBlockList($value)) {
                continue;
            }

            $nestedBlock = findSeededBlockByType($value, $type);

            if ($nestedBlock !== null) {
                return $nestedBlock;
            }
        }
    }

    return null;
}

/**
 * @param  list<array{
 *     type: string,
 *     props: array<string, mixed>
 * }>  $blocks
 * @return array{
 *     type: string,
 *     props: array<string, mixed>
 * }|null
 */
function findSeededBlockById(array $blocks, string $id): ?array
{
    foreach ($blocks as $block) {
        $props = $block['props'] ?? null;

        if (is_array($props) && ($props['id'] ?? null) === $id) {
            return $block;
        }

        if (! is_array($props)) {
            continue;
        }

        foreach ($props as $value) {
            if (! isSeededBlockList($value)) {
                continue;
            }

            $nestedBlock = findSeededBlockById($value, $id);

            if ($nestedBlock !== null) {
                return $nestedBlock;
            }
        }
    }

    return null;
}

/**
 * @param  list<array<string, mixed>>  $blocks
 */
function seedBlocksHaveIds(array $blocks): bool
{
    foreach ($blocks as $block) {
        if (! is_array($block)) {
            return false;
        }

        $props = is_array($block['props'] ?? null) ? $block['props'] : [];
        $id = $props['id'] ?? null;

        if (! is_string($id) || $id === '') {
            return false;
        }

        foreach ($props as $value) {
            if (! isSeededBlockList($value)) {
                continue;
            }

            if (! seedBlocksHaveIds($value)) {
                return false;
            }
        }
    }

    return true;
}

/**
 * @param  list<array<string, mixed>>  $blocks
 */
function seedBlocksHaveMatchingNodeIds(array $blocks): bool
{
    foreach ($blocks as $block) {
        if (! is_array($block)) {
            return false;
        }

        $props = is_array($block['props'] ?? null) ? $block['props'] : [];
        $nodeId = $block['id'] ?? null;
        $propId = $props['id'] ?? null;

        if (! is_string($nodeId) || ! is_string($propId) || $nodeId === '' || $nodeId !== $propId) {
            return false;
        }

        foreach ($props as $value) {
            if (! isSeededBlockList($value)) {
                continue;
            }

            if (! seedBlocksHaveMatchingNodeIds($value)) {
                return false;
            }
        }
    }

    return true;
}

/**
 * @param  list<array{
 *     type: string,
 *     props: array<string, mixed>
 * }>  $blocks
 */
function seedBlocksContainNoSectionTypes(array $blocks): bool
{
    foreach ($blocks as $block) {
        $type = $block['type'] ?? null;

        if (! is_string($type) || str_contains($type, 'Section')) {
            return false;
        }

        $props = $block['props'] ?? null;

        if (! is_array($props)) {
            continue;
        }

        foreach ($props as $value) {
            if (! isSeededBlockList($value)) {
                continue;
            }

            if (! seedBlocksContainNoSectionTypes($value)) {
                return false;
            }
        }
    }

    return true;
}

function isSeededBlockList(mixed $value): bool
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
