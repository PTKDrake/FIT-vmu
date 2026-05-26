<?php

use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\PostCategory;
use App\Models\User;
use App\QueryBuilders\CmsNavigationItemsQueryBuilder;
use App\QueryBuilders\CmsNavigationMenusQueryBuilder;
use App\QueryBuilders\CmsPagesQueryBuilder;
use App\QueryBuilders\CmsPostCategoriesQueryBuilder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\Exceptions\InvalidFilterQuery;
use Spatie\QueryBuilder\Exceptions\InvalidSortQuery;

test('cms pages query builder applies allowed filters sorts and includes', function () {
    $matchingAuthor = User::factory()->create();
    $otherAuthor = User::factory()->create();

    Page::factory()->for($otherAuthor, 'author')->create([
        'title' => 'Trang cũ',
        'slug' => 'trang-cu',
        'excerpt' => 'Bị loại vì trạng thái',
        'status' => 'draft',
    ]);

    Page::factory()->for($matchingAuthor, 'author')->create([
        'title' => 'Giới thiệu khoa FIT',
        'slug' => 'gioi-thieu-fit',
        'excerpt' => 'Trang giới thiệu chính thức',
        'status' => 'published',
    ]);

    bindPageNavigationQueryBuilderRequest([
        'filter' => [
            'search' => 'FIT',
            'status' => 'published',
            'author_id' => (string) $matchingAuthor->getKey(),
        ],
        'sort' => 'title',
        'include' => 'author',
    ]);

    $pages = CmsPagesQueryBuilder::make()->get();

    expect($pages)->toHaveCount(1)
        ->and($pages->first()?->title)->toBe('Giới thiệu khoa FIT')
        ->and($pages->first()?->relationLoaded('author'))->toBeTrue();
});

test('cms post categories query builder applies allowed filters sorts and includes', function () {
    $parent = PostCategory::factory()->create(['name' => 'Tin tức']);

    PostCategory::factory()->create([
        'name' => 'Thông báo cũ',
        'slug' => 'thong-bao-cu',
        'is_active' => false,
        'sort_order' => 5,
    ]);

    PostCategory::factory()->for($parent, 'parent')->create([
        'name' => 'Thông báo FIT',
        'slug' => 'thong-bao-fit',
        'description' => 'Danh mục dành cho FIT',
        'is_active' => true,
        'sort_order' => 1,
    ]);

    bindPageNavigationQueryBuilderRequest([
        'filter' => [
            'search' => 'FIT',
            'parent_id' => (string) $parent->getKey(),
            'is_active' => '1',
        ],
        'sort' => 'sort_order',
        'include' => 'parent',
    ]);

    $categories = CmsPostCategoriesQueryBuilder::make()->get();

    expect($categories)->toHaveCount(1)
        ->and($categories->first()?->name)->toBe('Thông báo FIT')
        ->and($categories->first()?->relationLoaded('parent'))->toBeTrue();
});

test('cms navigation menu and item query builders apply allowed filters sorts and includes', function () {
    $menu = NavigationMenu::factory()->create([
        'name' => 'Header FIT',
        'slug' => 'header-fit',
        'location' => 'header',
        'is_active' => true,
    ]);

    NavigationMenu::factory()->create([
        'name' => 'Footer cũ',
        'slug' => 'footer-cu',
        'location' => 'footer',
        'is_active' => false,
    ]);

    $parentItem = NavigationItem::factory()->for($menu, 'menu')->create([
        'title' => 'Tuyển sinh FIT',
        'type' => 'custom_url',
        'url' => '/tuyen-sinh-fit',
        'sort_order' => 1,
        'is_active' => true,
    ]);

    NavigationItem::factory()->for($menu, 'menu')->for($parentItem, 'parent')->create([
        'title' => 'Liên hệ',
        'type' => 'custom_url',
        'url' => '/lien-he',
        'sort_order' => 2,
        'is_active' => true,
    ]);

    bindPageNavigationQueryBuilderRequest([
        'filter' => [
            'search' => 'FIT',
            'location' => 'header',
            'is_active' => '1',
        ],
        'sort' => 'name',
        'include' => 'items',
    ]);

    $menus = CmsNavigationMenusQueryBuilder::make()->get();

    expect($menus)->toHaveCount(1)
        ->and($menus->first()?->name)->toBe('Header FIT')
        ->and($menus->first()?->relationLoaded('items'))->toBeTrue();

    bindPageNavigationQueryBuilderRequest([
        'filter' => [
            'search' => 'FIT',
            'menu_id' => (string) $menu->getKey(),
            'type' => 'custom_url',
            'is_active' => '1',
        ],
        'sort' => 'sort_order',
        'include' => 'menu,parent',
    ]);

    $items = CmsNavigationItemsQueryBuilder::make()->get();

    expect($items)->toHaveCount(1)
        ->and($items->first()?->title)->toBe('Tuyển sinh FIT')
        ->and($items->first()?->relationLoaded('menu'))->toBeTrue()
        ->and($items->first()?->relationLoaded('parent'))->toBeTrue();
});

test('cms page and navigation query builders reject unknown filters and sorts', function () {
    bindPageNavigationQueryBuilderRequest([
        'filter' => [
            'visibility' => 'public',
        ],
    ]);

    CmsPagesQueryBuilder::make()->get();
})->throws(InvalidFilterQuery::class);

test('cms navigation items query builder rejects unknown sorts', function () {
    bindPageNavigationQueryBuilderRequest([
        'sort' => 'menu_name',
    ]);

    CmsNavigationItemsQueryBuilder::make()->get();
})->throws(InvalidSortQuery::class);

test('cms categories and navigation items default to configured ordering', function () {
    $parent = PostCategory::factory()->create();

    $laterCategory = PostCategory::factory()->for($parent, 'parent')->create([
        'name' => 'B',
        'sort_order' => 2,
    ]);

    $earlierCategory = PostCategory::factory()->for($parent, 'parent')->create([
        'name' => 'A',
        'sort_order' => 1,
    ]);

    $menu = NavigationMenu::factory()->create();

    $laterItem = NavigationItem::factory()->for($menu, 'menu')->create([
        'title' => 'B mục',
        'sort_order' => 2,
    ]);

    $earlierItem = NavigationItem::factory()->for($menu, 'menu')->create([
        'title' => 'A mục',
        'sort_order' => 1,
    ]);

    bindPageNavigationQueryBuilderRequest([
        'filter' => [
            'parent_id' => (string) $parent->getKey(),
        ],
    ]);

    $categories = CmsPostCategoriesQueryBuilder::make()->get();

    bindPageNavigationQueryBuilderRequest([
        'filter' => [
            'menu_id' => (string) $menu->getKey(),
        ],
    ]);

    $items = CmsNavigationItemsQueryBuilder::make()->get();

    expect($categories->pluck('id')->intersect([$earlierCategory->getKey(), $laterCategory->getKey()])->values()->all())->toBe([
        $earlierCategory->getKey(),
        $laterCategory->getKey(),
    ])->and($items->pluck('id')->intersect([$earlierItem->getKey(), $laterItem->getKey()])->values()->all())->toBe([
        $earlierItem->getKey(),
        $laterItem->getKey(),
    ]);
});

function bindPageNavigationQueryBuilderRequest(array $query = []): void
{
    $request = Request::create('/cms', 'GET', $query);

    app()->instance('request', $request);
}
