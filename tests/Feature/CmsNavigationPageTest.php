<?php

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

test('cms navigation index renders backend menus for editors', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $headerMenu = NavigationMenu::factory()->create([
        'name' => 'Header chính',
        'slug' => 'header-chinh',
        'location' => 'header',
        'is_active' => true,
    ]);

    NavigationItem::factory()->for($headerMenu, 'menu')->create([
        'title' => 'Giới thiệu',
        'type' => 'custom_url',
        'url' => '/gioi-thieu',
        'sort_order' => 1,
    ]);

    NavigationMenu::factory()->create([
        'name' => 'Footer nhanh',
        'slug' => 'footer-nhanh',
        'location' => 'footer',
        'is_active' => true,
    ]);

    $this->actingAs($editor)
        ->get('/cms/navigation')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/navigation/index')
            ->has('navigationMenus', 2)
            ->where('navigationMenus.0.name', 'Footer nhanh')
            ->where('navigationMenus.1.name', 'Header chính')
            ->where('navigationMenus.1.items.0.title', 'Giới thiệu')
        );
});

test('cms navigation show renders the selected menu and resource catalog', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $author = User::factory()->create();

    $publishedPage = Page::factory()->for($author, 'author')->create([
        'title' => 'Trang giới thiệu',
        'slug' => 'gioi-thieu',
    ]);

    $publishedPost = Post::factory()->for($author, 'author')->create([
        'title' => 'Bài viết nổi bật',
        'slug' => 'bai-viet-noi-bat',
        'status' => 'published',
    ]);

    $category = PostCategory::factory()->create([
        'name' => 'Tin tuyển sinh',
        'slug' => 'tin-tuyen-sinh',
        'is_active' => true,
    ]);

    $menu = NavigationMenu::factory()->create([
        'name' => 'Header chính',
        'slug' => 'header-chinh',
        'location' => 'header',
    ]);

    NavigationItem::factory()->for($menu, 'menu')->create([
        'title' => 'Trang giới thiệu',
        'type' => 'page',
        'linkable_type' => Page::class,
        'linkable_id' => $publishedPage->id,
        'url' => null,
        'sort_order' => 1,
    ]);

    NavigationItem::factory()->for($menu, 'menu')->create([
        'title' => 'Tin tuyển sinh',
        'type' => 'post_category',
        'linkable_type' => PostCategory::class,
        'linkable_id' => $category->id,
        'url' => null,
        'sort_order' => 2,
    ]);

    NavigationItem::factory()->for($menu, 'menu')->create([
        'title' => 'Bài viết nổi bật',
        'type' => 'post',
        'linkable_type' => Post::class,
        'linkable_id' => $publishedPost->id,
        'url' => null,
        'sort_order' => 3,
    ]);

    $this->actingAs($editor)
        ->get("/cms/navigation/{$menu->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/navigation/show')
            ->where('navigationMenuId', $menu->id)
            ->where('navigationMenuName', 'Header chính')
            ->where('navigationMenus.0.name', 'Header chính')
            ->where('navigationMenus.0.items.0.title', 'Trang giới thiệu')
            ->where('resourceCatalog.page.0.label', 'Trang giới thiệu')
            ->where('resourceCatalog.post.0.label', 'Bài viết nổi bật')
            ->has('resourceCatalog.post_category', 2)
            ->where('resourceCatalog.post_category.0.type', 'post_category')
        );
});

test('cms navigation tree sync persists nested items from the frontend editor', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $publishedPage = Page::factory()->create([
        'title' => 'Trang giới thiệu',
        'slug' => 'gioi-thieu',
    ]);

    $menu = NavigationMenu::factory()->create([
        'name' => 'Header chính',
        'slug' => 'header-chinh',
        'location' => 'header',
    ]);

    NavigationItem::factory()->for($menu, 'menu')->create([
        'title' => 'Sẽ bị thay thế',
        'type' => 'custom_url',
        'url' => '/cu',
        'sort_order' => 1,
    ]);

    $payload = [
        'items' => [
            [
                'id' => 1001,
                'parent_id' => null,
                'title' => 'Giới thiệu',
                'type' => 'custom_url',
                'linkable_type' => null,
                'linkable_id' => null,
                'url' => '/gioi-thieu',
                'target' => '_self',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'id' => 1002,
                'parent_id' => 1001,
                'title' => 'Trang giới thiệu',
                'type' => 'page',
                'linkable_type' => 'page',
                'linkable_id' => $publishedPage->id,
                'url' => null,
                'target' => '_blank',
                'sort_order' => 1,
                'is_active' => true,
            ],
        ],
    ];

    $this->actingAs($editor)
        ->patch("/cms/navigation/{$menu->id}/items", $payload)
        ->assertRedirect();

    expect(NavigationItem::query()->where('menu_id', $menu->id)->count())->toBe(2)
        ->and(NavigationItem::query()->where('menu_id', $menu->id)->whereNull('parent_id')->value('title'))->toBe('Giới thiệu')
        ->and(NavigationItem::query()->where('menu_id', $menu->id)->where('title', 'Trang giới thiệu')->value('parent_id'))->toBeGreaterThan(0)
        ->and(NavigationItem::query()->where('menu_id', $menu->id)->where('title', 'Sẽ bị thay thế')->exists())->toBeFalse();
});

test('cms navigation menus can be created updated and deleted by editors', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $this->actingAs($editor)
        ->post('/cms/navigation', [
            'name' => 'Header phụ',
            'slug' => 'header-phu',
            'location' => 'header',
            'is_active' => true,
        ])
        ->assertRedirect('/cms/navigation');

    $menu = NavigationMenu::query()->where('slug', 'header-phu')->firstOrFail();

    $this->actingAs($editor)
        ->patch("/cms/navigation/{$menu->id}", [
            'name' => 'Header phụ đã sửa',
            'slug' => 'header-phu-moi',
            'location' => 'footer',
            'is_active' => false,
        ])
        ->assertRedirect();

    expect($menu->fresh()?->name)->toBe('Header phụ đã sửa')
        ->and($menu->fresh()?->slug)->toBe('header-phu-moi')
        ->and($menu->fresh()?->location)->toBe('footer')
        ->and($menu->fresh()?->is_active)->toBeFalse();

    $this->actingAs($editor)
        ->delete("/cms/navigation/{$menu->id}")
        ->assertRedirect('/cms/navigation');

    expect(NavigationMenu::query()->whereKey($menu->id)->exists())->toBeFalse();
});
