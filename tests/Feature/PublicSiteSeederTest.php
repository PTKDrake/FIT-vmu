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

    $fitFooterBlock = findSeededBlockByType($footerContent['content'], 'FitFooter');

    expect($fitFooterBlock)->not->toBeNull()
        ->and($fitFooterBlock['props'])->toMatchArray([
            'showBrand' => true,
            'showContact' => true,
            'showQuickLinks' => true,
            'showSupportLinks' => true,
            'showSocialLinks' => true,
            'showCopyright' => true,
            'showLegalLinks' => true,
            'quickLinksMenuId' => '1',
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

    $navigationBlock = findSeededBlockByType($headerContent['content'], 'FitNavigationHeader');

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

test('homepage seed keeps the CTA area in basic layout blocks only', function () {
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

    $containerBlock = findSeededBlockById($pageContent['content'], 'homepage-cta-container');
    $headingBlock = findSeededBlockById($pageContent['content'], 'homepage-cta-heading');
    $actionsBlock = findSeededBlockById($pageContent['content'], 'homepage-cta-actions');

    expect($containerBlock)->not->toBeNull()
        ->and($containerBlock['props'])->toMatchArray([
            'maxWidth' => 'xl',
        ])
        ->and($headingBlock)->not->toBeNull()
        ->and($headingBlock['type'])->toBe('Heading')
        ->and($actionsBlock)->not->toBeNull()
        ->and($actionsBlock['type'])->toBe('ButtonGroup')
        ->and(seedBlocksContainNoSectionTypes($pageContent['content']))->toBeTrue()
        ->and($actionsBlock['props']['buttons'][0])->toMatchArray([
            'text' => 'Xét tuyển trực tuyến',
        ])
        ->and($actionsBlock['props']['buttons'][1])->toMatchArray([
            'text' => 'Tải cẩm nang tuyển sinh',
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
