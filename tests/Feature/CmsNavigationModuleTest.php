<?php

declare(strict_types=1);

use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('cms navigation index returns real menus tree and resource catalog', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $page = Page::factory()->create([
        'title' => 'Trang giới thiệu khoa',
        'slug' => 'gioi-thieu-khoa',
        'status' => 'published',
    ]);

    $category = PostCategory::factory()->create([
        'name' => 'A Tin tuyển sinh',
        'is_active' => true,
    ]);

    $post = Post::factory()->create([
        'title' => 'Thông báo tuyển sinh',
        'slug' => 'thong-bao-tuyen-sinh',
        'status' => 'published',
    ]);
    $post->categories()->sync([$category->getKey()]);

    $menu = NavigationMenu::factory()->create([
        'name' => 'Header chính',
        'slug' => 'header-main',
        'location' => 'header',
    ]);

    $rootItem = NavigationItem::factory()->for($menu, 'menu')->create([
        'title' => 'Giới thiệu',
        'type' => 'page',
        'linkable_type' => Page::class,
        'linkable_id' => $page->getKey(),
        'url' => null,
        'sort_order' => 1,
    ]);

    NavigationItem::factory()->for($menu, 'menu')->for($rootItem, 'parent')->create([
        'title' => 'Tin tuyển sinh',
        'type' => 'post_category',
        'linkable_type' => PostCategory::class,
        'linkable_id' => $category->getKey(),
        'url' => null,
        'sort_order' => 1,
    ]);

    $this->actingAs($editor)
        ->get('/cms/navigation')
        ->assertOk()
        ->assertInertia(fn (Assert $inertiaPage) => $inertiaPage
            ->component('cms/navigation/index')
            ->has('menus', 2)
            ->where('menus.1.id', $menu->getKey())
            ->where('menus.1.slug', 'header-main')
            ->where('menus.1.items.0.id', $rootItem->getKey())
            ->where('menus.1.items.0.children.0.linkableType', 'post_category')
            ->has('resourceCatalog.page', 1)
            ->where('resourceCatalog.page.0.id', $page->getKey())
            ->has('resourceCatalog.post', 1)
            ->has('resourceCatalog.post_category')
            ->where('resourceCatalog.post_category.0.id', $category->getKey())
        );
});

test('cms navigation index bootstraps default menus when none exist yet', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    expect(NavigationMenu::query()->count())->toBe(0);

    $this->actingAs($editor)
        ->get('/cms/navigation')
        ->assertOk()
        ->assertInertia(fn (Assert $inertiaPage) => $inertiaPage
            ->component('cms/navigation/index')
            ->has('menus', 2)
            ->where('menus.0.slug', 'footer-quick-links')
            ->where('menus.1.slug', 'header-main')
        );

    $this->assertDatabaseHas('navigation_menus', [
        'slug' => 'header-main',
        'location' => 'header',
    ]);

    $this->assertDatabaseHas('navigation_menus', [
        'slug' => 'footer-quick-links',
        'location' => 'footer',
    ]);
});

test('cms navigation sync endpoint persists nested menu tree changes', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $page = Page::factory()->create([
        'status' => 'published',
    ]);

    $post = Post::factory()->create([
        'status' => 'published',
    ]);

    $menu = NavigationMenu::factory()->create();

    $existingRoot = NavigationItem::factory()->for($menu, 'menu')->create([
        'title' => 'Mục cũ',
        'type' => 'custom_url',
        'url' => '/cu',
        'sort_order' => 1,
    ]);

    $removedItem = NavigationItem::factory()->for($menu, 'menu')->create([
        'title' => 'Sẽ bị xoá',
        'type' => 'custom_url',
        'url' => '/xoa',
        'sort_order' => 2,
    ]);

    $response = $this->actingAs($editor)->patch(sprintf('/cms/navigation/%d', $menu->getKey()), [
        'items' => [
            [
                'id' => $existingRoot->getKey(),
                'title' => 'Trang đã cập nhật',
                'type' => 'page',
                'linkableType' => 'page',
                'linkableId' => $page->getKey(),
                'url' => null,
                'target' => '_self',
                'isActive' => true,
                'children' => [
                    [
                        'title' => 'Mục con mới',
                        'type' => 'custom_url',
                        'linkableType' => null,
                        'linkableId' => null,
                        'url' => '/muc-con-moi',
                        'target' => '_blank',
                        'isActive' => true,
                        'children' => [],
                    ],
                ],
            ],
            [
                'title' => 'Bài viết mới',
                'type' => 'post',
                'linkableType' => 'post',
                'linkableId' => $post->getKey(),
                'url' => null,
                'target' => '_self',
                'isActive' => false,
                'children' => [],
            ],
        ],
    ]);

    $response->assertRedirect('/cms/navigation');

    $existingRoot->refresh();

    expect($existingRoot->title)->toBe('Trang đã cập nhật')
        ->and($existingRoot->type)->toBe('page')
        ->and($existingRoot->linkable_type)->toBe(Page::class)
        ->and($existingRoot->linkable_id)->toBe($page->getKey())
        ->and($existingRoot->sort_order)->toBe(1)
        ->and($existingRoot->parent_id)->toBeNull();

    $newChild = NavigationItem::query()
        ->where('menu_id', $menu->getKey())
        ->where('parent_id', $existingRoot->getKey())
        ->where('title', 'Mục con mới')
        ->first();

    expect($newChild)->not->toBeNull()
        ->and($newChild?->sort_order)->toBe(1)
        ->and($newChild?->url)->toBe('/muc-con-moi')
        ->and($newChild?->target)->toBe('_blank');

    $newRootPostLink = NavigationItem::query()
        ->where('menu_id', $menu->getKey())
        ->where('parent_id', null)
        ->where('title', 'Bài viết mới')
        ->first();

    expect($newRootPostLink)->not->toBeNull()
        ->and($newRootPostLink?->sort_order)->toBe(2)
        ->and($newRootPostLink?->type)->toBe('post')
        ->and($newRootPostLink?->linkable_type)->toBe(Post::class)
        ->and($newRootPostLink?->is_active)->toBeFalse();

    $this->assertDatabaseMissing('navigation_items', [
        'id' => $removedItem->getKey(),
    ]);
});

test('cms navigation sync endpoint rejects invalid custom url payload', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $menu = NavigationMenu::factory()->create();

    $response = $this->actingAs($editor)->from('/cms/navigation')->patch(
        sprintf('/cms/navigation/%d', $menu->getKey()),
        [
            'items' => [
                [
                    'title' => 'Liên kết lỗi',
                    'type' => 'custom_url',
                    'linkableType' => null,
                    'linkableId' => null,
                    'url' => '',
                    'target' => '_self',
                    'isActive' => true,
                    'children' => [],
                ],
            ],
        ],
    );

    $response->assertRedirect('/cms/navigation')
        ->assertSessionHasErrors(['items.0.url']);

    $this->assertDatabaseCount('navigation_items', 0);
});
