<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Navigation\BuildNavigationMenusViewDataAction;
use App\Http\Controllers\Controller;
use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use Inertia\Response;

final class NavigationMenuShowController extends Controller
{
    public function __invoke(
        NavigationMenu $navigationMenu,
        BuildNavigationMenusViewDataAction $buildNavigationMenusViewData,
    ): Response {
        /** @var int $navigationMenuId */
        $navigationMenuId = $navigationMenu->getKey();

        $navigationMenus = NavigationMenu::query()
            ->with(['items'])
            ->orderBy('name')
            ->get();

        $viewData = $buildNavigationMenusViewData($navigationMenus);

        return inertia('cms/navigation/show', [
            'navigationMenuId' => $navigationMenuId,
            'navigationMenuName' => $navigationMenu->name,
            'navigationMenus' => $viewData['data'],
            'navigationStateVersion' => $viewData['version'],
            'resourceCatalog' => $this->buildResourceCatalog(),
        ]);
    }

    /**
     * @return array{
     *     page: array<int, array{id: int, label: string, meta: string, type: string}>,
     *     post: array<int, array{id: int, label: string, meta: string, type: string}>,
     *     post_category: array<int, array{id: int, label: string, meta: string, type: string}>
     * }
     */
    private function buildResourceCatalog(): array
    {
        return [
            'page' => Page::query()
                ->select(['id', 'title', 'slug', 'status', 'published_at'])
                ->where('status', 'published')
                ->orderBy('title')
                ->get()
                ->map(static function (Page $page): array {
                    /** @var int $pageId */
                    $pageId = $page->getKey();

                    return [
                        'id' => $pageId,
                        'label' => $page->title,
                        'meta' => '/'.$page->slug,
                        'type' => 'page',
                    ];
                })
                ->all(),
            'post' => Post::query()
                ->select(['id', 'title', 'slug', 'status', 'published_at'])
                ->where('status', 'published')
                ->orderBy('title')
                ->get()
                ->map(static function (Post $post): array {
                    /** @var int $postId */
                    $postId = $post->getKey();

                    return [
                        'id' => $postId,
                        'label' => $post->title,
                        'meta' => 'Bài viết published',
                        'type' => 'post',
                    ];
                })
                ->all(),
            'post_category' => PostCategory::query()
                ->select(['id', 'name', 'parent_id', 'is_active'])
                ->where('is_active', true)
                ->orderBy('name')
                ->get()
                ->map(static function (PostCategory $category): array {
                    /** @var int $categoryId */
                    $categoryId = $category->getKey();

                    return [
                        'id' => $categoryId,
                        'label' => $category->name,
                        'meta' => $category->parent_id === null ? 'Danh mục gốc' : 'Danh mục con',
                        'type' => 'post_category',
                    ];
                })
                ->all(),
        ];
    }
}
