<?php

declare(strict_types=1);

use App\Models\Page;
use App\Models\SiteLayout;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

test('puck component alias migration normalizes legacy page and site layout payloads', function () {
    $page = Page::factory()->createOne([
        'content' => json_encode([
            'root' => ['props' => ['title' => 'Legacy page']],
            'content' => [
                [
                    'type' => 'HeroCustom',
                    'props' => [
                        'id' => 'legacy-hero',
                        'children' => [
                            [
                                'type' => 'LatestPosts',
                                'props' => ['id' => 'legacy-feed'],
                            ],
                        ],
                    ],
                ],
            ],
            'zones' => [
                'sidebar' => [
                    [
                        'type' => 'AuthStatus',
                        'props' => ['id' => 'legacy-auth'],
                    ],
                ],
            ],
        ], JSON_THROW_ON_ERROR),
    ]);

    $layout = SiteLayout::factory()->createOne([
        'header_data' => json_encode([
            'root' => ['props' => []],
            'content' => [
                [
                    'type' => 'FitNavigationHeader',
                    'props' => ['id' => 'legacy-header'],
                ],
            ],
            'zones' => [],
        ], JSON_THROW_ON_ERROR),
        'footer_data' => json_encode([
            'root' => ['props' => []],
            'content' => [
                [
                    'type' => 'FitFooter',
                    'props' => ['id' => 'legacy-footer'],
                ],
            ],
            'zones' => [],
        ], JSON_THROW_ON_ERROR),
        'left_data' => json_encode([
            'root' => ['props' => []],
            'content' => [
                [
                    'type' => 'Categories',
                    'props' => ['id' => 'legacy-categories'],
                ],
            ],
            'zones' => [],
        ], JSON_THROW_ON_ERROR),
        'right_data' => json_encode([
            'root' => ['props' => []],
            'content' => [
                [
                    'type' => 'LinkList',
                    'props' => ['id' => 'legacy-links'],
                ],
            ],
            'zones' => [],
        ], JSON_THROW_ON_ERROR),
    ]);

    $migration = require database_path('migrations/2026_06_19_063050_normalize_puck_component_type_aliases_in_pages_and_site_layouts_table.php');
    $migration->up();

    $pagePayload = json_decode((string) DB::table('pages')->where('id', $page->getKey())->value('content'), true, flags: JSON_THROW_ON_ERROR);
    $headerPayload = json_decode((string) DB::table('site_layouts')->where('id', $layout->getKey())->value('header_data'), true, flags: JSON_THROW_ON_ERROR);
    $footerPayload = json_decode((string) DB::table('site_layouts')->where('id', $layout->getKey())->value('footer_data'), true, flags: JSON_THROW_ON_ERROR);
    $leftPayload = json_decode((string) DB::table('site_layouts')->where('id', $layout->getKey())->value('left_data'), true, flags: JSON_THROW_ON_ERROR);
    $rightPayload = json_decode((string) DB::table('site_layouts')->where('id', $layout->getKey())->value('right_data'), true, flags: JSON_THROW_ON_ERROR);

    expect($pagePayload['content'][0]['type'])->toBe('FeaturedHero')
        ->and($pagePayload['content'][0]['props']['children'][0]['type'])->toBe('PostFeed')
        ->and($pagePayload['zones']['sidebar'][0]['type'])->toBe('AuthLinks')
        ->and($headerPayload['content'][0]['type'])->toBe('SiteHeader')
        ->and($footerPayload['content'][0]['type'])->toBe('SiteFooter')
        ->and($leftPayload['content'][0]['type'])->toBe('PostCategoryList')
        ->and($rightPayload['content'][0]['type'])->toBe('CustomLinkList');
});
