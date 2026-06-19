<?php

declare(strict_types=1);

use App\Actions\Puck\BuildPuckDynamicDataAction;
use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use App\Models\Unit;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('navigation menu sync validates and stores items of type unit', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $menu = NavigationMenu::factory()->create();

    $syncData = [
        'items' => [
            [
                'id' => 1,
                'parent_id' => null,
                'title' => 'Các Đơn Vị',
                'type' => 'unit',
                'linkable_type' => null,
                'linkable_id' => null,
                'url' => null,
                'target' => '_self',
                'sort_order' => 0,
                'is_active' => true,
            ],
        ],
    ];

    $response = $this->actingAs($editor)
        ->patch(route('cms.navigation.items.sync', $menu), $syncData);

    $response->assertRedirect();

    $this->assertDatabaseHas('navigation_items', [
        'menu_id' => $menu->id,
        'title' => 'Các Đơn Vị',
        'type' => 'unit',
        'linkable_type' => null,
        'linkable_id' => null,
        'url' => null,
        'is_active' => true,
    ]);
});

test('navigation menu sync stores none items with manual children', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $menu = NavigationMenu::factory()->create([
        'location' => 'header',
        'is_active' => true,
    ]);

    $syncData = [
        'items' => [
            [
                'id' => 1,
                'parent_id' => null,
                'title' => 'Tài nguyên',
                'type' => 'none',
                'linkable_type' => null,
                'linkable_id' => null,
                'url' => null,
                'target' => '_self',
                'sort_order' => 0,
                'is_active' => true,
            ],
            [
                'id' => 2,
                'parent_id' => 1,
                'title' => 'Trang con',
                'type' => 'custom_url',
                'linkable_type' => null,
                'linkable_id' => null,
                'url' => '/trang-con',
                'target' => '_self',
                'sort_order' => 0,
                'is_active' => true,
            ],
        ],
    ];

    $response = $this->actingAs($editor)
        ->patch(route('cms.navigation.items.sync', $menu), $syncData);

    $response->assertRedirect();

    $noneItem = NavigationItem::query()
        ->where('menu_id', $menu->id)
        ->where('type', 'none')
        ->firstOrFail();

    $this->assertDatabaseHas('navigation_items', [
        'menu_id' => $menu->id,
        'parent_id' => $noneItem->id,
        'title' => 'Trang con',
        'type' => 'custom_url',
        'url' => '/trang-con',
    ]);

    /** @var BuildPuckDynamicDataAction $builder */
    $builder = app(BuildPuckDynamicDataAction::class);
    $data = $builder(null, true);

    $headerMenu = collect($data['navigationMenus'])->firstWhere('id', $menu->id);
    expect($headerMenu)->not->toBeNull()
        ->and($headerMenu['items'][0]['title'])->toBe('Tài nguyên')
        ->and($headerMenu['items'][0]['type'])->toBe('none')
        ->and($headerMenu['items'][0]['url'])->toBe('#')
        ->and($headerMenu['items'][0]['children'])->toHaveCount(1)
        ->and($headerMenu['items'][0]['children'][0]['url'])->toBe('/trang-con');
});

test('navigation menu sync rejects invalid unit item configuration', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $menu = NavigationMenu::factory()->create();

    // linkable_type must be null for unit type
    $invalidData = [
        'items' => [
            [
                'id' => 1,
                'parent_id' => null,
                'title' => 'Các Đơn Vị',
                'type' => 'unit',
                'linkable_type' => 'page',
                'linkable_id' => 1,
                'url' => null,
                'target' => '_self',
                'sort_order' => 0,
                'is_active' => true,
            ],
        ],
    ];

    $response = $this->actingAs($editor)
        ->patch(route('cms.navigation.items.sync', $menu), $invalidData);

    $response->assertSessionHasErrors(['items.0.linkable_type']);
});

test('navigation tree builder appends active units under unit type menu item', function () {
    $menu = NavigationMenu::factory()->create([
        'location' => 'header',
        'is_active' => true,
    ]);

    NavigationItem::factory()->create([
        'menu_id' => $menu->id,
        'title' => 'Các Đơn Vị',
        'type' => 'unit',
        'is_active' => true,
        'sort_order' => 1,
    ]);

    // Create units
    $unit1 = Unit::factory()->create([
        'name' => 'Khoa Công nghệ thông tin',
        'slug' => 'khoa-cntt',
        'sort_order' => 2,
        'is_active' => true,
    ]);

    $unit2 = Unit::factory()->create([
        'name' => 'Bộ môn Hệ thống thông tin',
        'slug' => 'bo-mon-httt',
        'sort_order' => 1,
        'is_active' => true,
    ]);

    $inactiveUnit = Unit::factory()->create([
        'name' => 'Bộ môn Khoa học máy tính',
        'slug' => 'bo-mon-khmt',
        'sort_order' => 0,
        'is_active' => false,
    ]);

    /** @var BuildPuckDynamicDataAction $builder */
    $builder = app(BuildPuckDynamicDataAction::class);
    $data = $builder(null, true);

    $navigationMenus = $data['navigationMenus'] ?? [];

    $headerMenu = collect($navigationMenus)->firstWhere('location', 'header');
    expect($headerMenu)->not->toBeNull();

    $items = $headerMenu['items'] ?? [];
    expect($items)->toHaveCount(1);

    $unitMenuItem = $items[0];
    expect($unitMenuItem['title'])->toBe('Các Đơn Vị');
    expect($unitMenuItem['url'])->toBe('#');

    $children = $unitMenuItem['children'];
    // Inactive unit is excluded, and active units are sorted by sort_order
    expect($children)->toHaveCount(2);

    // First child is $unit2 because sort_order=1
    expect($children[0]['id'])->toBe(100000 + $unit2->id);
    expect($children[0]['title'])->toBe($unit2->name);
    expect($children[0]['url'])->toBe('/don-vi/'.$unit2->slug);
    expect($children[0]['target'])->toBe('_self');

    // Second child is $unit1 because sort_order=2
    expect($children[1]['id'])->toBe(100000 + $unit1->id);
    expect($children[1]['title'])->toBe($unit1->name);
    expect($children[1]['url'])->toBe('/don-vi/'.$unit1->slug);
    expect($children[1]['target'])->toBe('_self');
});
