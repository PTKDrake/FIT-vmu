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

    $socialLinksBlock = findSeededBlockByType($footerContent['content'], 'SocialLinks');
    $copyrightBarBlock = findSeededBlockByType($footerContent['content'], 'CopyrightBar');

    expect($socialLinksBlock)->not->toBeNull()
        ->and($socialLinksBlock['props'])->toMatchArray([
            'layout' => 'horizontal',
            'iconSize' => 'md',
            'showLabels' => true,
            'surfaceTone' => 'transparent',
            'surfaceBorder' => 'none',
            'surfaceRadius' => 'none',
            'surfacePadding' => 'none',
            'surfaceShadow' => 'none',
        ])
        ->and($socialLinksBlock['props']['links'])->toBeArray()
        ->and($socialLinksBlock['props']['links'])->toHaveCount(3)
        ->and($socialLinksBlock['props']['links'][0])->toMatchArray([
            'platform' => 'facebook',
            'label' => 'Facebook Group',
        ])
        ->and($socialLinksBlock['props']['links'][2])->toMatchArray([
            'platform' => 'email',
            'label' => 'fit@vimaru.edu.vn',
        ])
        ->and($copyrightBarBlock)->not->toBeNull()
        ->and($copyrightBarBlock['props'])->toMatchArray([
            'text' => '© {year} Faculty of Information Technology, VMU. All rights reserved.',
            'surfaceTone' => 'transparent',
            'surfaceBorder' => 'none',
            'surfaceRadius' => 'none',
            'surfacePadding' => 'md',
            'surfaceShadow' => 'none',
            'className' => '',
        ])
        ->and($copyrightBarBlock['props']['links'])->toBeArray()
        ->and($copyrightBarBlock['props']['links'])->toHaveCount(2)
        ->and($copyrightBarBlock['props']['links'][0])->toMatchArray([
            'label' => 'Chính sách bảo mật',
        ]);

    $contactInfoBlock = findSeededBlockByType($footerContent['content'], 'ContactInfo');
    $footerNavigationBlock = findSeededBlockByType($footerContent['content'], 'NavigationMenu');

    expect($contactInfoBlock)->not->toBeNull()
        ->and($contactInfoBlock['props'])->toMatchArray([
            'maxWidth' => 'sm',
            'textAlign' => 'center',
            'textAlignFromLg' => 'left',
            'positionFromLg' => 'start',
        ])
        ->and($footerNavigationBlock)->not->toBeNull()
        ->and($footerNavigationBlock['props'])->toMatchArray([
            'maxWidth' => 'sm',
            'textAlign' => 'center',
            'textAlignFromLg' => 'left',
            'positionFromLg' => 'end',
        ]);
});

test('public site header seed exposes mobile drawer props for the navigation block', function () {
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

    $navigationBlock = findSeededBlockByType($headerContent['content'], 'NavigationMenu');

    expect($navigationBlock)->not->toBeNull()
        ->and($navigationBlock['props'])->toMatchArray([
            'menuId' => '1',
            'orientation' => 'horizontal',
            'mobileButtonLabel' => 'Mở menu điều hướng',
            'mobileLogoAlt' => 'FIT VMU',
            'mobileLogoUrl' => '/logo.png',
            'mobilePanelTitle' => 'Khoa Công nghệ thông tin',
            'fullWidthOnMobile' => true,
            'growFromMd' => true,
            'basisFromMd' => '44rem',
            'maxWidth' => 'none',
        ]);

    $authStatusBlock = findSeededBlockByType($headerContent['content'], 'AuthStatus');
    $headingBlock = findSeededBlockByType($headerContent['content'], 'Heading');

    expect($authStatusBlock)->not->toBeNull()
        ->and($authStatusBlock['props'])->toMatchArray([
            'buttonLabel' => 'Đăng nhập',
            'profileVariant' => 'compact',
            'fullWidthOnMobile' => true,
            'autoWidthFromMd' => true,
            'noShrinkFromMd' => true,
        ])
        ->and($headingBlock)->not->toBeNull()
        ->and($headingBlock['props'])->toMatchArray([
            'title' => 'Khoa Công nghệ thông tin',
            'subtitle' => 'Trường Đại học Hàng hải Việt Nam',
            'fullWidthOnMobile' => true,
            'autoWidthFromMd' => true,
            'noShrinkFromMd' => true,
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
