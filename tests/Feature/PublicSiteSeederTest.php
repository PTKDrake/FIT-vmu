<?php

declare(strict_types=1);

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
