<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\SiteLayout;
use App\Models\SiteSetting;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

final class CmsSiteLayoutsTest extends TestCase
{
    use RefreshDatabase;

    public function test_cms_layouts_can_be_created_updated_and_guarded_from_invalid_deletion(): void
    {
        $this->seed(RoleAndPermissionSeeder::class);

        $editor = User::factory()->createOne();
        $editor->assignRole('editor');

        $this->actingAs($editor);

        $slotJson = '{"root":{"props":{}},"content":[{"type":"AuthStatus","props":{"id":"auth","buttonLabel":"Dang nhap"}}]}';

        $this->get('/cms/layouts')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('cms/layouts/index')
                ->has('layouts')
                ->has('defaultLayoutIds')
            );

        $storeResponse = $this->post('/cms/layouts', [
            'name' => 'Layout public',
            'key' => 'layout-public',
            'header_data' => $slotJson,
            'footer_data' => null,
            'left_data' => null,
            'right_data' => null,
        ]);

        $storeResponse->assertSessionHasNoErrors();
        $storeResponse->assertRedirect();

        $layout = SiteLayout::query()->where('key', 'layout-public')->first();
        expect($layout)->not->toBeNull();
        /** @var SiteLayout $layout */
        $layoutId = $layout->id;

        $storeResponse->assertRedirect(sprintf('/cms/layouts/%d/edit', $layoutId));

        expect($layout->header_data)->toContain('AuthStatus');

        $this->patch(sprintf('/cms/layouts/%d', $layoutId), [
            'name' => 'Layout public updated',
            'key' => 'layout-public-updated',
            'header_data' => $slotJson,
            'footer_data' => $slotJson,
            'left_data' => '',
            'right_data' => '',
        ])->assertRedirect();

        $layout->refresh();

        expect($layout->name)->toBe('Layout public updated')
            ->and($layout->key)->toBe('layout-public-updated')
            ->and($layout->left_data)->toBeNull();

        $this->post(sprintf('/cms/layouts/%d/clone', $layoutId))
            ->assertRedirect('/cms/layouts');

        $clone = SiteLayout::query()
            ->where('key', 'layout-public-updated-ban-sao')
            ->first();

        expect($clone)->not->toBeNull();
        expect($clone?->name)->toBe('Layout public updated (Bản sao)')
            ->and($clone?->header_data)->toBe($layout->header_data)
            ->and($clone?->footer_data)->toBe($layout->footer_data)
            ->and($clone?->left_data)->toBe($layout->left_data)
            ->and($clone?->right_data)->toBe($layout->right_data);

        SiteSetting::set(SiteSetting::KEY_DEFAULT_PAGE_LAYOUT, $layoutId);

        $this->delete(sprintf('/cms/layouts/%d', $layoutId))
            ->assertRedirect();

        $this->assertDatabaseHas('site_layouts', [
            'id' => $layoutId,
        ]);

        expect(session('message'))->toBe('Không thể xóa layout đang được đặt làm mặc định.')
            ->and(session('type'))->toBe('error');
    }

    public function test_pages_can_select_a_site_layout_and_public_pages_use_assigned_layout_or_default_fallback(): void
    {
        $this->seed(RoleAndPermissionSeeder::class);

        $editor = User::factory()->createOne();
        $editor->assignRole('editor');

        $defaultLayout = SiteLayout::factory()->createOne([
            'name' => 'Default shell',
            'key' => 'default-shell',
            'header_data' => '{"root":{"props":{}},"content":[{"type":"Heading","props":{"id":"default-heading","title":"Default header","subtitle":"","level":2,"alignment":"left"}}]}',
        ]);
        SiteSetting::set(SiteSetting::KEY_DEFAULT_PAGE_LAYOUT, $defaultLayout->getKey());

        $assignedLayout = SiteLayout::factory()->createOne();

        $this->actingAs($editor);

        $this->post('/cms/pages', [
            'title' => 'Trang public',
            'slug' => 'trang-public',
            'excerpt' => null,
            'seo_title' => null,
            'seo_description' => null,
            'content' => '{"root":{"props":{"title":"Trang public"}},"content":[]}',
            'content_format' => 'puck_json',
            'visibility' => 'public',
            'site_layout_id' => $assignedLayout->getKey(),
            'status' => 'draft',
        ])->assertRedirect();

        $page = Page::query()->where('slug', 'trang-public')->firstOrFail();

        expect($page->site_layout_id)->toBe($assignedLayout->getKey());

        $page->update(['status' => 'published']);

        $this->get('/trang-public')
            ->assertOk()
            ->assertInertia(fn (Assert $inertia) => $inertia
                ->component('public/page')
                ->where('page.slug', 'trang-public')
                ->where('layout.id', $assignedLayout->getKey())
            );

        $page->update(['site_layout_id' => null]);

        $this->get('/trang-public')
            ->assertOk()
            ->assertInertia(fn (Assert $inertia) => $inertia
                ->component('public/page')
                ->where('layout.id', $defaultLayout->getKey())
            );
    }

    public function test_layout_builder_source_endpoints_expose_public_dynamic_records(): void
    {
        $this->seed(RoleAndPermissionSeeder::class);

        $editor = User::factory()->createOne();
        $editor->assignRole('editor');

        $category = PostCategory::factory()->createOne([
            'name' => 'Thông báo',
            'slug' => 'thong-bao',
            'is_active' => true,
        ]);
        $post = Post::factory()->createOne([
            'title' => 'Thong bao tu data that',
            'slug' => 'thong-bao-tu-data-that',
            'status' => 'published',
            'published_at' => now(),
        ]);
        $post->categories()->sync([$category->getKey()]);

        $this->actingAs($editor)
            ->getJson('/cms/layout-builder/sources/posts')
            ->assertOk()
            ->assertJsonFragment([
                'label' => 'Thong bao tu data that',
            ]);

        $this->actingAs($editor)
            ->getJson('/cms/layout-builder/sources/categories')
            ->assertOk()
            ->assertJsonFragment([
                'label' => 'Thông báo',
            ]);
    }

    public function test_site_layout_builder_pages_receive_dynamic_navigation_data(): void
    {
        $this->seed(RoleAndPermissionSeeder::class);

        $editor = User::factory()->createOne();
        $editor->assignRole('editor');

        $menu = NavigationMenu::factory()->createOne([
            'name' => 'Main Menu',
            'location' => 'header',
            'is_active' => true,
        ]);

        NavigationItem::factory()->createOne([
            'menu_id' => $menu->getKey(),
            'title' => 'Trang chủ',
            'url' => '/',
            'is_active' => true,
        ]);

        $layout = SiteLayout::factory()->createOne();

        $this->actingAs($editor)
            ->get('/cms/layouts/create')
            ->assertOk()
            ->assertInertia(fn (Assert $inertia) => $inertia
                ->component('cms/layouts/create')
                ->where('dynamicData.navigationMenus.0.name', 'Main Menu')
                ->where('dynamicData.navigationMenus.0.items.0.title', 'Trang chủ')
            );

        $this->actingAs($editor)
            ->get(sprintf('/cms/layouts/%d/edit', $layout->getKey()))
            ->assertOk()
            ->assertInertia(fn (Assert $inertia) => $inertia
                ->component('cms/layouts/edit')
                ->where('can.exportPuckJson', true)
                ->where('dynamicData.navigationMenus.0.name', 'Main Menu')
                ->where('dynamicData.navigationMenus.0.items.0.title', 'Trang chủ')
            );
    }

    public function test_public_page_response_hydrates_dynamic_data_for_puck_blocks(): void
    {
        $category = PostCategory::factory()->createOne([
            'name' => 'Thông báo',
            'slug' => 'thong-bao',
            'is_active' => true,
        ]);
        $post = Post::factory()->createOne([
            'title' => 'Dynamic published post',
            'slug' => 'dynamic-published-post',
            'status' => 'published',
            'published_at' => now(),
        ]);
        $post->categories()->sync([$category->getKey()]);

        Page::factory()->createOne([
            'title' => 'Dynamic Page',
            'slug' => 'dynamic-page',
            'status' => 'published',
            'content' => '{"root":{"props":{"title":"Dynamic Page"}},"content":[{"type":"LatestPosts","props":{"id":"latest","title":"Tin mới","limit":3,"categoryId":"all","layout":"grid","showCTA":false}}]}',
        ]);

        $this->get('/dynamic-page')
            ->assertOk()
            ->assertInertia(fn (Assert $inertia) => $inertia
                ->component('public/page')
                ->where('dynamicData.posts.0.title', 'Dynamic published post')
                ->has('dynamicData.categories')
            );
    }
}
