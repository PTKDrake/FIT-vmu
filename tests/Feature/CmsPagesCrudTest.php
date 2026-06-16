<?php

use App\Events\CmsContentChanged;
use App\Models\Page;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Support\Facades\Event;
use Inertia\Testing\AssertableInertia as Assert;

test('cms pages create edit clone and delete flows persist page data', function () {
    $this->seed(RoleAndPermissionSeeder::class);
    Event::fake([CmsContentChanged::class]);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $this->actingAs($editor);

    $storeResponse = $this->post('/cms/pages', [
        'title' => 'Trang gioi thieu',
        'excerpt' => 'Tom tat ngan',
        'seo_title' => 'SEO gioi thieu',
        'seo_description' => 'Mo ta SEO gioi thieu',
        'content' => '{"root":{"props":{"title":"Trang gioi thieu"}},"content":[]}',
        'content_format' => 'puck_json',
        'visibility' => 'public',
        'status' => 'draft',
    ]);

    $page = Page::query()->where('slug', 'trang-gioi-thieu')->firstOrFail();

    $storeResponse
        ->assertRedirect(sprintf('/cms/pages/%d/builder', $page->getKey()));

    expect($page->title)->toBe('Trang gioi thieu')
        ->and($page->slug)->toBe('trang-gioi-thieu')
        ->and($page->seo_title)->toBe('SEO gioi thieu')
        ->and($page->seo_description)->toBe('Mo ta SEO gioi thieu')
        ->and($page->author_id)->toBe($editor->getKey());

    // Test GET create page
    $this->get('/cms/pages/create')
        ->assertOk()
        ->assertInertia(fn (Assert $inertiaPage) => $inertiaPage
            ->component('cms/pages/create')
        );

    // Test GET edit page (metadata editor)
    $this->get(sprintf('/cms/pages/%d/edit', $page->getKey()))
        ->assertOk()
        ->assertInertia(fn (Assert $inertiaPage) => $inertiaPage
            ->component('cms/pages/edit')
            ->where('page.id', $page->getKey())
            ->where('page.slug', 'trang-gioi-thieu')
            ->where('page.contentFormat', 'puck_json')
        );

    // Test GET builder page (Puck builder editor)
    $this->get(sprintf('/cms/pages/%d/builder', $page->getKey()))
        ->assertOk()
        ->assertInertia(fn (Assert $inertiaPage) => $inertiaPage
            ->component('cms/pages/builder')
            ->where('can.exportPuckJson', true)
            ->where('page.id', $page->getKey())
            ->where('page.slug', 'trang-gioi-thieu')
            ->where('page.contentFormat', 'puck_json')
        );

    // Test GET show page (fullscreen preview)
    $this->get(sprintf('/cms/pages/%d/show', $page->getKey()))
        ->assertOk()
        ->assertInertia(fn (Assert $inertiaPage) => $inertiaPage
            ->component('cms/pages/show')
            ->where('page.id', $page->getKey())
            ->where('page.slug', 'trang-gioi-thieu')
        );

    $this->patch(sprintf('/cms/pages/%d/metadata', $page->getKey()), [
        'title' => 'Trang gioi thieu moi',
        'slug' => 'trang-gioi-thieu-moi',
        'excerpt' => 'Tom tat moi',
        'seo_title' => 'SEO moi',
        'seo_description' => 'Mo ta SEO moi',
        'visibility' => 'public',
    ])->assertRedirect();

    $page->refresh();

    expect($page->title)->toBe('Trang gioi thieu moi')
        ->and($page->slug)->toBe('trang-gioi-thieu-moi')
        ->and($page->seo_title)->toBe('SEO moi');

    $this->patch(sprintf('/cms/pages/%d/content', $page->getKey()), [
        'content' => '{"root":{"props":{"title":"Trang moi"}},"content":[{"type":"RichTextSection","props":{"id":"section-1","title":"Noi dung","body":"Cap nhat"}}]}',
        'content_format' => 'puck_json',
    ])->assertRedirect();

    $page->refresh();

    expect($page->content)->toContain('"section-1"');

    $this->post(sprintf('/cms/pages/%d/clone', $page->getKey()))
        ->assertRedirect('/cms/pages');

    $clone = Page::query()
        ->where('slug', 'trang-gioi-thieu-moi-ban-sao')
        ->firstOrFail();

    expect($clone->title)->toBe('Trang gioi thieu moi (Bản sao)')
        ->and($clone->status)->toBe('draft')
        ->and($clone->author_id)->toBe($editor->getKey())
        ->and($clone->content)->toBe($page->content);

    $this->delete(sprintf('/cms/pages/%d', $page->getKey()))
        ->assertRedirect('/cms/pages');

    $this->assertDatabaseMissing('pages', [
        'id' => $page->getKey(),
    ]);

    Event::assertDispatchedTimes(CmsContentChanged::class, 5);
    Event::assertDispatched(CmsContentChanged::class, function (CmsContentChanged $event): bool {
        return $event->resource === 'pages'
            && $event->action === 'content-updated'
            && $event->title === 'Trang gioi thieu moi';
    });
});
