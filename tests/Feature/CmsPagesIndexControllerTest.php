<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Page;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('cms pages index filters sorts and paginates rows from backend props', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $otherAuthor = User::factory()->create([
        'name' => 'Nguyen Van B',
    ]);

    $matchingAuthor = User::factory()->create([
        'name' => 'Tran Thi A',
    ]);

    Page::factory()->for($otherAuthor, 'author')->create([
        'title' => 'Trang cu khong hien thi',
        'slug' => 'trang-cu-khong-hien-thi',
        'visibility' => 'hidden',
        'seo_title' => 'SEO cu',
        'created_at' => now()->subDay(),
    ]);

    foreach (range(1, 11) as $index) {
        Page::factory()->for($matchingAuthor, 'author')->create([
            'title' => sprintf('Trang FIT %02d', $index),
            'slug' => sprintf('trang-fit-%02d', $index),
            'visibility' => 'students',
            'seo_title' => sprintf('SEO FIT %02d', $index),
            'seo_description' => 'Mo ta SEO du lieu bang pages',
            'published_at' => now()->subDays($index),
            'created_at' => now()->subMinutes($index - 1),
        ]);
    }

    $this->actingAs($editor);

    $this->get('/cms/pages?search=FIT&status=students&sort=title&direction=asc&page=2&perPage=10')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/pages/index')
            ->has('pages.data', 1)
            ->where('pages.data.0.title', 'Trang FIT 11')
            ->where('pages.data.0.authorName', 'Tran Thi A')
            ->where('pages.data.0.seoTitle', 'SEO FIT 11')
            ->where('pages.data.0.urlPath', '/trang-fit-11')
            ->where('pages.data.0.visibility', 'students')
            ->where('pages.meta.currentPage', 2)
            ->where('pages.meta.lastPage', 2)
            ->where('pages.meta.perPage', 10)
            ->where('pages.meta.total', 11)
        );
});

test('cms pages inertia xhr response keeps collection data under props', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    Page::factory()->for($editor, 'author')->create([
        'title' => 'Trang FIT thử nghiệm',
        'slug' => 'trang-fit-thu-nghiem',
    ]);

    $version = app(HandleInertiaRequests::class)->version(request());

    $response = $this->actingAs($editor)
        ->withHeaders([
            'X-Inertia' => 'true',
            'X-Inertia-Version' => (string) $version,
            'X-Requested-With' => 'XMLHttpRequest',
        ])
        ->get('/cms/pages?search=FIT');

    $response->assertOk()
        ->assertJsonPath('component', 'cms/pages/index')
        ->assertJsonPath('props.pages.data.0.title', 'Trang FIT thử nghiệm');

    expect($response->json('pages'))->toBeNull();
});
