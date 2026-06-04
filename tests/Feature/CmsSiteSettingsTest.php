<?php

declare(strict_types=1);

use App\Models\Page;
use App\Models\SiteLayout;
use App\Models\SiteSetting;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('cms settings page renders all key-value relations', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $admin = User::factory()->createOne();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->get('/cms/settings')
        ->assertOk()
        ->assertInertia(fn (Assert $inertia) => $inertia
            ->component('cms/settings/index')
            ->has('settings')
            ->has('layoutOptions')
            ->has('pageOptions')
        );
});

test('cms settings page persists page and layout relations', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $admin = User::factory()->createOne();
    $admin->assignRole('admin');

    $homepage = Page::factory()->create([
        'status' => 'published',
        'visibility' => 'public',
    ]);
    $notFound = Page::factory()->create([
        'status' => 'published',
        'visibility' => 'public',
    ]);
    $pageLayout = SiteLayout::factory()->published()->createOne([
        'key' => 'page-default',
    ]);
    $categoryLayout = SiteLayout::factory()->published()->createOne([
        'key' => 'category-default',
    ]);
    $postLayout = SiteLayout::factory()->published()->createOne([
        'key' => 'post-default',
    ]);

    $this->actingAs($admin)
        ->patch('/cms/settings', [
            SiteSetting::KEY_HOMEPAGE_PAGE => $homepage->getKey(),
            SiteSetting::KEY_NOT_FOUND_PAGE => $notFound->getKey(),
            SiteSetting::KEY_STUDENT_HOME_PAGE => null,
            SiteSetting::KEY_DEFAULT_PAGE_LAYOUT => $pageLayout->getKey(),
            SiteSetting::KEY_DEFAULT_CATEGORY_LAYOUT => $categoryLayout->getKey(),
            SiteSetting::KEY_DEFAULT_POST_LAYOUT => $postLayout->getKey(),
        ])
        ->assertRedirect();

    expect(SiteSetting::homepagePageId())->toBe($homepage->getKey())
        ->and(SiteSetting::notFoundPageId())->toBe($notFound->getKey())
        ->and(SiteSetting::studentHomePageId())->toBeNull()
        ->and(SiteSetting::defaultPageLayoutId())->toBe($pageLayout->getKey())
        ->and(SiteSetting::defaultCategoryLayoutId())->toBe($categoryLayout->getKey())
        ->and(SiteSetting::defaultPostLayoutId())->toBe($postLayout->getKey());
});
