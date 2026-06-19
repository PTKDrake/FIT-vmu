<?php

declare(strict_types=1);

use App\Models\Page;
use App\Models\SiteLayout;
use App\Models\SiteSetting;
use Database\Seeders\DatabaseSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('public homepage is seeded through site layout and page data', function () {
    $this->seed(DatabaseSeeder::class);

    $layout = SiteLayout::query()
        ->where('key', 'default-page-layout')
        ->firstOrFail();

    $homepage = Page::query()
        ->where('slug', 'trang-chu-vmu')
        ->firstOrFail();

    $homepagePageId = SiteSetting::homepagePageId();

    expect(SiteSetting::defaultPageLayoutId())->toBe($layout->getKey())
        ->and($homepagePageId)->toBe($homepage->getKey());

    /** @var array{
     *     root: array{props: array{title: string}},
     *     content: list<array{id: string, type: string, props: array<string, mixed>}>,
     *     zones: array<string, mixed>
     * } $pageContent
     */
    $pageContent = json_decode($homepage->content ?? '', true, flags: JSON_THROW_ON_ERROR);

    expect($pageContent['root']['props']['title'])->toBe('Trang chủ khoa công nghệ thông tin')
        ->and(collect($pageContent['content'])->pluck('type')->all())->toBe([
            'HeroCustom',
            'Container',
        ])
        ->and($pageContent['content'][0]['props'])->toMatchArray([
            'id' => 'HeroCustom-ff7451f9-46ff-419f-92a3-bb35080c2a84',
            'badge' => 'Tuyển sinh 2026',
            'primaryActionLabel' => 'Giới thiệu khoa',
            'secondaryActionLabel' => 'Tuyển sinh',
        ])
        ->and($pageContent['content'][1]['props'])->toMatchArray([
            'id' => 'Container-8ea2593b-7cab-4366-a57c-a37786855931',
            'maxWidth' => 'lg',
            'surfacePadding' => 'md',
        ])
        ->and(collect(collectHomepageBlockIds($pageContent['content']))->filter()->isNotEmpty())->toBeTrue()
        ->and(homepageBlocksContainNoSectionTypes($pageContent['content']))->toBeTrue();

    $headerContent = json_decode($layout->header_data ?? '', true, flags: JSON_THROW_ON_ERROR);
    $footerContent = json_decode($layout->footer_data ?? '', true, flags: JSON_THROW_ON_ERROR);

    expect(collect($headerContent['content'])->pluck('type')->all())->toBe([
        'FitNavigationHeader',
    ])
        ->and(collect($footerContent['content'])->pluck('type')->all())->toBe([
            'FitFooter',
        ])
        ->and(homepageBlocksHaveIds($pageContent['content']))->toBeTrue()
        ->and(homepageBlocksHaveIds($headerContent['content']))->toBeTrue()
        ->and(homepageBlocksHaveIds($footerContent['content']))->toBeTrue()
        ->and(homepageBlocksHaveMatchingNodeIds($pageContent['content']))->toBeTrue()
        ->and(homepageBlocksHaveMatchingNodeIds($headerContent['content']))->toBeTrue()
        ->and(homepageBlocksHaveMatchingNodeIds($footerContent['content']))->toBeTrue()
        ->and(homepageBlocksContainNoSectionTypes($headerContent['content']))->toBeTrue()
        ->and(homepageBlocksContainNoSectionTypes($footerContent['content']))->toBeTrue();

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $inertia) => $inertia
            ->component('public/page')
            ->where('page.slug', 'trang-chu-vmu')
            ->where('layout.id', $layout->getKey())
        );
});

/**
 * @param  list<array<string, mixed>>  $blocks
 * @return list<string>
 */
function collectHomepageBlockIds(array $blocks): array
{
    $ids = [];

    foreach ($blocks as $block) {
        if (! is_array($block)) {
            continue;
        }

        $props = is_array($block['props'] ?? null) ? $block['props'] : [];
        $id = $props['id'] ?? null;

        if (is_string($id) && $id !== '') {
            $ids[] = $id;
        }

        foreach ($props as $value) {
            if (! isHomepageBlockList($value)) {
                continue;
            }

            $ids = [...$ids, ...collectHomepageBlockIds($value)];
        }
    }

    return $ids;
}

/**
 * @param  list<array<string, mixed>>  $blocks
 */
function homepageBlocksHaveIds(array $blocks): bool
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
            if (! isHomepageBlockList($value)) {
                continue;
            }

            if (! homepageBlocksHaveIds($value)) {
                return false;
            }
        }
    }

    return true;
}

/**
 * @param  list<array<string, mixed>>  $blocks
 */
function homepageBlocksHaveMatchingNodeIds(array $blocks): bool
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
            if (! isHomepageBlockList($value)) {
                continue;
            }

            if (! homepageBlocksHaveMatchingNodeIds($value)) {
                return false;
            }
        }
    }

    return true;
}

function isHomepageBlockList(mixed $value): bool
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
function homepageBlocksContainNoSectionTypes(array $blocks): bool
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
            if (! isHomepageBlockList($value)) {
                continue;
            }

            if (! homepageBlocksContainNoSectionTypes($value)) {
                return false;
            }
        }
    }

    return true;
}
