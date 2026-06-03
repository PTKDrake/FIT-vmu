<?php

use App\Http\Requests\PublishPageRequest;
use App\Http\Requests\StoreNavigationItemRequest;
use App\Http\Requests\StoreNavigationMenuRequest;
use App\Http\Requests\StorePageRequest;
use App\Http\Requests\StorePostCategoryRequest;
use App\Http\Requests\UpdateNavigationItemRequest;
use App\Http\Requests\UpdateNavigationMenuRequest;
use App\Http\Requests\UpdatePageMetadataRequest;
use App\Http\Requests\UpdatePageRequest;
use App\Http\Requests\UpdatePostCategoryRequest;
use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\StudentGroup;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('page category and navigation policies follow permission checks', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $page = Page::factory()->create();
    $postCategory = PostCategory::factory()->create();
    $navigationMenu = NavigationMenu::factory()->create();
    $navigationItem = NavigationItem::factory()->for($navigationMenu, 'menu')->create();

    expect(Gate::forUser($editor)->allows('viewAny', Page::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('view', $page))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('create', Page::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('update', $page))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('delete', $page))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('publish', $page))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('viewAny', PostCategory::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('create', PostCategory::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('update', $postCategory))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('delete', $postCategory))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('viewAny', NavigationMenu::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('create', NavigationMenu::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('update', $navigationMenu))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('delete', $navigationMenu))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('viewAny', NavigationItem::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('create', NavigationItem::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('update', $navigationItem))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('delete', $navigationItem))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('viewAny', Page::class))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('create', Page::class))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('viewAny', PostCategory::class))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('create', PostCategory::class))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('viewAny', NavigationMenu::class))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('create', NavigationItem::class))->toBeFalse();
});

test('page requests authorize against the page policy', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $page = Page::factory()->create();

    expect(makeStorePageRequest([], $editor)->authorize())->toBeTrue()
        ->and(makeStorePageRequest([], $staff)->authorize())->toBeFalse()
        ->and(makeUpdatePageRequest([], $editor, $page)->authorize())->toBeTrue()
        ->and(makeUpdatePageRequest([], $staff, $page)->authorize())->toBeFalse()
        ->and(makePublishPageRequest([], $editor, $page)->authorize())->toBeTrue()
        ->and(makePublishPageRequest([], $staff, $page)->authorize())->toBeFalse();
});

test('page requests validate content workflow payloads', function () {
    $page = Page::factory()->create(['slug' => 'gioi-thieu-vmu']);

    $validData = [
        'title' => 'Giới thiệu VMU',
        'slug' => 've-vmu-fit',
        'excerpt' => 'Tóm tắt trang',
        'content' => '{"root":{"props":{"title":"VMU"}}}',
        'content_format' => 'puck_json',
        'thumbnail_id' => $page->thumbnail_id,
        'visibility' => 'public',
        'status' => 'draft',
    ];

    expect(validatePageNavigationRequest(makeStorePageRequest($validData), $validData)->passes())->toBeTrue()
        ->and(validatePageNavigationRequest(makeStorePageRequest([
            ...$validData,
            'slug' => 'gioi-thieu-vmu',
        ]), [
            ...$validData,
            'slug' => 'gioi-thieu-vmu',
        ])->errors()->keys())->toContain('slug')
        ->and(validatePageNavigationRequest(makeStorePageRequest([
            ...$validData,
            'content_format' => 'blocknote_json',
        ]), [
            ...$validData,
            'content_format' => 'blocknote_json',
        ])->errors()->keys())->toContain('content_format')
        ->and(validatePageNavigationRequest(makePublishPageRequest([
            'status' => 'published',
            'published_at' => now()->toDateTimeString(),
        ], null, $page), [
            'status' => 'published',
            'published_at' => now()->toDateTimeString(),
        ])->passes())->toBeTrue()
        ->and(validatePageNavigationRequest(makePublishPageRequest([
            'status' => 'draft',
        ], null, $page), [
            'status' => 'draft',
        ])->errors()->keys())->toContain('status');
});

test('page requests reject auth and settings slugs', function () {
    $page = Page::factory()->create(['slug' => 'gioi-thieu-vmu']);

    $storeRequest = validatePageNavigationRequest(makeStorePageRequest([
        'title' => 'Trang tĩnh',
        'slug' => 'auth/google/redirect',
        'excerpt' => 'Tóm tắt trang',
        'content' => '{"root":{"props":{"title":"VMU"}}}',
        'content_format' => 'puck_json',
        'visibility' => 'public',
        'status' => 'draft',
    ]), [
        'title' => 'Trang tĩnh',
        'slug' => 'auth/google/redirect',
        'excerpt' => 'Tóm tắt trang',
        'content' => '{"root":{"props":{"title":"VMU"}}}',
        'content_format' => 'puck_json',
        'status' => 'draft',
    ]);

    $updateRequest = validatePageNavigationRequest(makeUpdatePageRequest([
        'title' => 'Trang tĩnh',
        'slug' => '/settings/profile',
        'excerpt' => 'Tóm tắt trang',
        'content' => '{"root":{"props":{"title":"VMU"}}}',
        'content_format' => 'puck_json',
        'visibility' => 'public',
        'status' => 'draft',
    ], null, $page), [
        'title' => 'Trang tĩnh',
        'slug' => '/settings/profile',
        'excerpt' => 'Tóm tắt trang',
        'content' => '{"root":{"props":{"title":"VMU"}}}',
        'content_format' => 'puck_json',
        'status' => 'draft',
    ]);

    $metadataRequest = validatePageNavigationRequest(makeUpdatePageMetadataRequest([
        'title' => 'Trang tĩnh',
        'slug' => 'settings/appearance',
        'excerpt' => 'Tóm tắt trang',
        'seo_title' => 'SEO',
        'seo_description' => 'Mô tả SEO',
        'visibility' => 'public',
    ], null, $page), [
        'title' => 'Trang tĩnh',
        'slug' => 'settings/appearance',
        'excerpt' => 'Tóm tắt trang',
        'seo_title' => 'SEO',
        'seo_description' => 'Mô tả SEO',
        'visibility' => 'public',
    ]);

    expect($storeRequest->errors()->keys())->toContain('slug')
        ->and($updateRequest->errors()->keys())->toContain('slug')
        ->and($metadataRequest->errors()->keys())->toContain('slug');
});

test('page requests require accessible student groups for student_groups visibility', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $page = Page::factory()->create(['slug' => 'gioi-thieu-vmu']);
    $globalGroup = StudentGroup::factory()->global()->create();
    $privateGroup = StudentGroup::factory()->for($editor, 'owner')->create();

    $validData = [
        'title' => 'Trang cho nhóm sinh viên',
        'slug' => 'trang-cho-nhom-sinh-vien',
        'excerpt' => 'Tóm tắt trang',
        'content' => '{"root":{"props":{"title":"VMU"}}}',
        'content_format' => 'puck_json',
        'thumbnail_id' => $page->thumbnail_id,
        'visibility' => 'student_groups',
        'student_group_ids' => [$globalGroup->getKey(), $privateGroup->getKey()],
        'status' => 'draft',
    ];

    expect(validatePageNavigationRequest(makeStorePageRequest($validData, $editor), $validData)->passes())->toBeTrue()
        ->and(validatePageNavigationRequest(makeStorePageRequest([
            ...$validData,
            'student_group_ids' => [],
        ], $editor), [
            ...$validData,
            'student_group_ids' => [],
        ])->errors()->keys())->toContain('student_group_ids');
});

test('post category requests authorize and validate parent constraints', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $parent = PostCategory::factory()->create();
    $category = PostCategory::factory()->create(['slug' => 'tin-tuc-noi-bat']);

    $validData = [
        'name' => 'Thông báo',
        'slug' => 'thong-bao-fit',
        'description' => 'Danh mục thông báo',
        'parent_id' => $parent->getKey(),
        'sort_order' => 2,
        'is_active' => true,
    ];

    expect(makeStorePostCategoryRequest([], $editor)->authorize())->toBeTrue()
        ->and(makeStorePostCategoryRequest([], $staff)->authorize())->toBeFalse()
        ->and(makeUpdatePostCategoryRequest([], $editor, $category)->authorize())->toBeTrue()
        ->and(makeUpdatePostCategoryRequest([], $staff, $category)->authorize())->toBeFalse()
        ->and(validatePageNavigationRequest(makeStorePostCategoryRequest($validData), $validData)->passes())->toBeTrue()
        ->and(validatePageNavigationRequest(makeStorePostCategoryRequest([
            ...$validData,
            'slug' => 'tin-tuc-noi-bat',
        ]), [
            ...$validData,
            'slug' => 'tin-tuc-noi-bat',
        ])->errors()->keys())->toContain('slug')
        ->and(validatePageNavigationRequest(makeUpdatePostCategoryRequest([
            ...$validData,
            'parent_id' => $category->getKey(),
        ], null, $category), [
            ...$validData,
            'parent_id' => $category->getKey(),
        ])->errors()->keys())->toContain('parent_id');
});

test('navigation menu requests authorize and validate unique slugs', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $menu = NavigationMenu::factory()->create(['slug' => 'header-main']);

    $validData = [
        'name' => 'Header chính',
        'slug' => 'header-phu',
        'location' => 'header',
        'is_active' => true,
    ];

    expect(makeStoreNavigationMenuRequest([], $editor)->authorize())->toBeTrue()
        ->and(makeStoreNavigationMenuRequest([], $staff)->authorize())->toBeFalse()
        ->and(makeUpdateNavigationMenuRequest([], $editor, $menu)->authorize())->toBeTrue()
        ->and(makeUpdateNavigationMenuRequest([], $staff, $menu)->authorize())->toBeFalse()
        ->and(validatePageNavigationRequest(makeStoreNavigationMenuRequest($validData), $validData)->passes())->toBeTrue()
        ->and(validatePageNavigationRequest(makeStoreNavigationMenuRequest([
            ...$validData,
            'slug' => 'header-main',
        ]), [
            ...$validData,
            'slug' => 'header-main',
        ])->errors()->keys())->toContain('slug');
});

test('navigation item requests validate custom urls linkable targets and parent menu constraints', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $menu = NavigationMenu::factory()->create();
    $otherMenu = NavigationMenu::factory()->create();
    $parentItem = NavigationItem::factory()->for($menu, 'menu')->create();
    $foreignParent = NavigationItem::factory()->for($otherMenu, 'menu')->create();
    $page = Page::factory()->create();
    $post = Post::factory()->create();
    $item = NavigationItem::factory()->for($menu, 'menu')->create();

    $validCustomUrlData = [
        'menu_id' => $menu->getKey(),
        'parent_id' => $parentItem->getKey(),
        'title' => 'Giới thiệu',
        'type' => 'custom_url',
        'linkable_type' => null,
        'linkable_id' => null,
        'url' => '/gioi-thieu',
        'target' => '_self',
        'sort_order' => 1,
        'is_active' => true,
    ];

    $validPageLinkData = [
        'menu_id' => $menu->getKey(),
        'parent_id' => $parentItem->getKey(),
        'title' => 'Trang tuyển sinh',
        'type' => 'page',
        'linkable_type' => Page::class,
        'linkable_id' => $page->getKey(),
        'url' => null,
        'target' => '_blank',
        'sort_order' => 2,
        'is_active' => true,
    ];

    expect(makeStoreNavigationItemRequest([], $editor)->authorize())->toBeTrue()
        ->and(makeUpdateNavigationItemRequest([], $editor, $item)->authorize())->toBeTrue()
        ->and(validatePageNavigationRequest(makeStoreNavigationItemRequest($validCustomUrlData), $validCustomUrlData)->passes())->toBeTrue()
        ->and(validatePageNavigationRequest(makeStoreNavigationItemRequest($validPageLinkData), $validPageLinkData)->passes())->toBeTrue()
        ->and(validatePageNavigationRequest(makeStoreNavigationItemRequest([
            ...$validCustomUrlData,
            'url' => null,
        ]), [
            ...$validCustomUrlData,
            'url' => null,
        ])->errors()->keys())->toContain('url')
        ->and(validatePageNavigationRequest(makeStoreNavigationItemRequest([
            ...$validCustomUrlData,
            'linkable_type' => Post::class,
            'linkable_id' => $post->getKey(),
        ]), [
            ...$validCustomUrlData,
            'linkable_type' => Post::class,
            'linkable_id' => $post->getKey(),
        ])->errors()->keys())->toContain('linkable_type', 'linkable_id')
        ->and(validatePageNavigationRequest(makeStoreNavigationItemRequest([
            ...$validPageLinkData,
            'linkable_type' => Post::class,
            'url' => 'https://example.com',
        ]), [
            ...$validPageLinkData,
            'linkable_type' => Post::class,
            'url' => 'https://example.com',
        ])->errors()->keys())->toContain('linkable_type', 'url')
        ->and(validatePageNavigationRequest(makeStoreNavigationItemRequest([
            ...$validPageLinkData,
            'parent_id' => $foreignParent->getKey(),
        ]), [
            ...$validPageLinkData,
            'parent_id' => $foreignParent->getKey(),
        ])->errors()->keys())->toContain('parent_id')
        ->and(validatePageNavigationRequest(makeUpdateNavigationItemRequest([
            ...$validCustomUrlData,
            'parent_id' => $item->getKey(),
        ], null, $item), [
            ...$validCustomUrlData,
            'parent_id' => $item->getKey(),
        ])->errors()->keys())->toContain('parent_id');
});

function makeStorePageRequest(array $data, ?User $user = null): StorePageRequest
{
    /** @var StorePageRequest $request */
    $request = StorePageRequest::create('/pages', 'POST', $data);
    $request->setUserResolver(static fn (): ?User => $user);

    return $request;
}

function makeUpdatePageRequest(array $data, ?User $user = null, ?Page $page = null): UpdatePageRequest
{
    /** @var UpdatePageRequest $request */
    $request = UpdatePageRequest::create('/pages/'.($page?->getKey() ?? 'page'), 'PUT', $data);
    $request->setUserResolver(static fn (): ?User => $user);
    $request->setRouteResolver(static fn (): object => routeParameterMap(['page' => $page]));

    return $request;
}

function makeUpdatePageMetadataRequest(array $data, ?User $user = null, ?Page $page = null): UpdatePageMetadataRequest
{
    /** @var UpdatePageMetadataRequest $request */
    $request = UpdatePageMetadataRequest::create('/pages/'.($page?->getKey() ?? 'page').'/metadata', 'PATCH', $data);
    $request->setUserResolver(static fn (): ?User => $user);
    $request->setRouteResolver(static fn (): object => routeParameterMap(['page' => $page]));

    return $request;
}

function makePublishPageRequest(array $data, ?User $user = null, ?Page $page = null): PublishPageRequest
{
    /** @var PublishPageRequest $request */
    $request = PublishPageRequest::create('/pages/'.($page?->getKey() ?? 'page').'/publish', 'PATCH', $data);
    $request->setUserResolver(static fn (): ?User => $user);
    $request->setRouteResolver(static fn (): object => routeParameterMap(['page' => $page]));

    return $request;
}

function makeStorePostCategoryRequest(array $data, ?User $user = null): StorePostCategoryRequest
{
    /** @var StorePostCategoryRequest $request */
    $request = StorePostCategoryRequest::create('/post-categories', 'POST', $data);
    $request->setUserResolver(static fn (): ?User => $user);

    return $request;
}

function makeUpdatePostCategoryRequest(array $data, ?User $user = null, ?PostCategory $postCategory = null): UpdatePostCategoryRequest
{
    /** @var UpdatePostCategoryRequest $request */
    $request = UpdatePostCategoryRequest::create('/post-categories/'.($postCategory?->getKey() ?? 'post-category'), 'PUT', $data);
    $request->setUserResolver(static fn (): ?User => $user);
    $request->setRouteResolver(static fn (): object => routeParameterMap(['post_category' => $postCategory]));

    return $request;
}

function makeStoreNavigationMenuRequest(array $data, ?User $user = null): StoreNavigationMenuRequest
{
    /** @var StoreNavigationMenuRequest $request */
    $request = StoreNavigationMenuRequest::create('/navigation-menus', 'POST', $data);
    $request->setUserResolver(static fn (): ?User => $user);

    return $request;
}

function makeUpdateNavigationMenuRequest(array $data, ?User $user = null, ?NavigationMenu $navigationMenu = null): UpdateNavigationMenuRequest
{
    /** @var UpdateNavigationMenuRequest $request */
    $request = UpdateNavigationMenuRequest::create('/navigation-menus/'.($navigationMenu?->getKey() ?? 'navigation-menu'), 'PUT', $data);
    $request->setUserResolver(static fn (): ?User => $user);
    $request->setRouteResolver(static fn (): object => routeParameterMap(['navigation_menu' => $navigationMenu]));

    return $request;
}

function makeStoreNavigationItemRequest(array $data, ?User $user = null): StoreNavigationItemRequest
{
    /** @var StoreNavigationItemRequest $request */
    $request = StoreNavigationItemRequest::create('/navigation-items', 'POST', $data);
    $request->setUserResolver(static fn (): ?User => $user);

    return $request;
}

function makeUpdateNavigationItemRequest(array $data, ?User $user = null, ?NavigationItem $navigationItem = null): UpdateNavigationItemRequest
{
    /** @var UpdateNavigationItemRequest $request */
    $request = UpdateNavigationItemRequest::create('/navigation-items/'.($navigationItem?->getKey() ?? 'navigation-item'), 'PUT', $data);
    $request->setUserResolver(static fn (): ?User => $user);
    $request->setRouteResolver(static fn (): object => routeParameterMap(['navigation_item' => $navigationItem]));

    return $request;
}

function routeParameterMap(array $parameters): object
{
    return new class($parameters)
    {
        /**
         * @param  array<string, mixed>  $parameters
         */
        public function __construct(private readonly array $parameters) {}

        public function parameter(string $name, mixed $default = null): mixed
        {
            return $this->parameters[$name] ?? $default;
        }
    };
}

function validatePageNavigationRequest(object $request, array $data)
{
    $validator = Validator::make($data, $request->rules());

    if (method_exists($request, 'withValidator')) {
        $request->withValidator($validator);
    }

    return $validator;
}
