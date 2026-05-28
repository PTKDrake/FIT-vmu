<?php

use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;

test('post category page and navigation tables expose the expected domain columns', function () {
    expect(Schema::hasColumns('post_categories', [
        'id',
        'name',
        'slug',
        'description',
        'parent_id',
        'sort_order',
        'is_active',
        'created_at',
        'updated_at',
    ]))->toBeTrue()
        ->and(Schema::hasColumns('post_post_category', [
            'post_id',
            'category_id',
            'created_at',
            'updated_at',
        ]))->toBeTrue()
        ->and(Schema::hasColumns('pages', [
            'id',
            'title',
            'slug',
            'excerpt',
            'seo_title',
            'seo_description',
            'content',
            'content_format',
            'thumbnail_id',
            'author_id',
            'status',
            'published_at',
            'created_at',
            'updated_at',
        ]))->toBeTrue()
        ->and(Schema::hasColumns('navigation_menus', [
            'id',
            'name',
            'slug',
            'location',
            'is_active',
            'created_at',
            'updated_at',
        ]))->toBeTrue()
        ->and(Schema::hasColumns('navigation_items', [
            'id',
            'menu_id',
            'parent_id',
            'title',
            'type',
            'linkable_type',
            'linkable_id',
            'url',
            'target',
            'sort_order',
            'is_active',
            'created_at',
            'updated_at',
        ]))->toBeTrue();
});

test('post category page and navigation defaults match the mvp content conventions', function () {
    $author = User::factory()->create();

    $category = PostCategory::query()->create([
        'name' => 'Thong bao',
        'slug' => 'thong-bao',
    ])->refresh();

    $page = Page::query()->create([
        'title' => 'Trang chu',
        'slug' => 'trang-chu',
        'author_id' => $author->id,
    ])->refresh();

    $menu = NavigationMenu::query()->create([
        'name' => 'Header chinh',
        'slug' => 'header-chinh',
        'location' => 'header',
    ])->refresh();

    $item = NavigationItem::query()->create([
        'menu_id' => $menu->id,
        'title' => 'Trang chu',
        'type' => 'custom_url',
        'url' => '/',
    ])->refresh();

    expect($category->description)->toBeNull()
        ->and($category->parent_id)->toBeNull()
        ->and($category->sort_order)->toBe(0)
        ->and($category->is_active)->toBeTrue()
        ->and($page->excerpt)->toBeNull()
        ->and($page->seo_title)->toBeNull()
        ->and($page->seo_description)->toBeNull()
        ->and($page->content)->toBeNull()
        ->and($page->content_format)->toBe('puck_json')
        ->and($page->status)->toBe('draft')
        ->and($page->published_at)->toBeNull()
        ->and($menu->is_active)->toBeTrue()
        ->and($item->parent_id)->toBeNull()
        ->and($item->linkable_type)->toBeNull()
        ->and($item->linkable_id)->toBeNull()
        ->and($item->target)->toBe('_self')
        ->and($item->sort_order)->toBe(0)
        ->and($item->is_active)->toBeTrue();
});

test('post category tree page authoring and navigation polymorphic links resolve correctly', function () {
    $author = User::factory()->create();
    $category = PostCategory::factory()->create();
    $childCategory = PostCategory::factory()->for($category, 'parent')->create();
    $post = Post::factory()->for($author, 'author')->create();
    $post->categories()->sync([$category->id]);
    $page = Page::factory()->for($author, 'author')->create([
        'published_at' => '2026-05-24 09:15:00',
    ]);
    $menu = NavigationMenu::factory()->create();
    $parentItem = NavigationItem::factory()->for($menu, 'menu')->create([
        'title' => 'Tin tuc',
        'type' => 'post_category',
        'url' => null,
        'linkable_type' => PostCategory::class,
        'linkable_id' => $category->id,
    ]);
    $pageItem = NavigationItem::factory()->for($menu, 'menu')->for($parentItem, 'parent')->create([
        'title' => 'Gioi thieu',
        'type' => 'page',
        'url' => null,
        'linkable_type' => Page::class,
        'linkable_id' => $page->id,
    ]);
    $postItem = NavigationItem::factory()->for($menu, 'menu')->create([
        'title' => 'Bai viet noi bat',
        'type' => 'post',
        'url' => null,
        'linkable_type' => Post::class,
        'linkable_id' => $post->id,
    ]);

    expect($childCategory->parent?->is($category))->toBeTrue()
        ->and($category->children)->toHaveCount(1)
        ->and($post->categories->contains($category))->toBeTrue()
        ->and($category->posts)->toHaveCount(1)
        ->and($page->author->is($author))->toBeTrue()
        ->and($author->authoredPages)->toHaveCount(1)
        ->and($page->published_at)->toBeInstanceOf(Carbon::class)
        ->and($parentItem->menu->is($menu))->toBeTrue()
        ->and($pageItem->parent?->is($parentItem))->toBeTrue()
        ->and($parentItem->children)->toHaveCount(1)
        ->and($parentItem->linkable?->is($category))->toBeTrue()
        ->and($pageItem->linkable?->is($page))->toBeTrue()
        ->and($postItem->linkable?->is($post))->toBeTrue()
        ->and($menu->items)->toHaveCount(3);
});

test('category page and navigation slugs remain unique', function () {
    $category = PostCategory::factory()->create([
        'slug' => 'tin-tuc',
    ]);

    $page = Page::factory()->create([
        'slug' => 'gioi-thieu',
    ]);

    $menu = NavigationMenu::factory()->create([
        'slug' => 'header-main',
    ]);

    expect(fn () => PostCategory::factory()->create([
        'slug' => $category->slug,
    ]))->toThrow(QueryException::class)
        ->and(fn () => Page::factory()->create([
            'slug' => $page->slug,
        ]))->toThrow(QueryException::class)
        ->and(fn () => NavigationMenu::factory()->create([
            'slug' => $menu->slug,
        ]))->toThrow(QueryException::class);
});
