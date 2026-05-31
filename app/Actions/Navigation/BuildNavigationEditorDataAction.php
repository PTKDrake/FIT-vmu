<?php

declare(strict_types=1);

namespace App\Actions\Navigation;

use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class BuildNavigationEditorDataAction
{
    /**
     * @return array{
     *     editorStateKey: string,
     *     menus: list<array{
     *         id: int,
     *         isActive: bool,
     *         location: string,
     *         name: string,
     *         slug: string,
     *         items: list<array{
     *             id: int,
     *             isActive: bool,
     *             linkableId: ?int,
     *             linkableType: ?string,
     *             menuId: int,
     *             parentId: ?int,
     *             sortOrder: int,
     *             target: string,
     *             title: string,
     *             type: string,
     *             url: ?string,
     *             children: list<mixed>
     *         }>
     *     }>,
     *     resourceCatalog: array{
     *         page: list<array{id: int, label: string, meta: string, type: string}>,
     *         post: list<array{id: int, label: string, meta: string, type: string}>,
     *         post_category: list<array{id: int, label: string, meta: string, type: string}>
     *     }
     * }
     */
    public function __invoke(): array
    {
        $this->ensureDefaultMenusExist();

        $menus = NavigationMenu::query()
            ->with('items')
            ->orderBy('location')
            ->orderBy('name')
            ->get();

        /** @var list<array{
         *     id: int,
         *     isActive: bool,
         *     location: string,
         *     name: string,
         *     slug: string,
         *     items: list<array{
         *         id: int,
         *         isActive: bool,
         *         linkableId: ?int,
         *         linkableType: ?string,
         *         menuId: int,
         *         parentId: ?int,
         *         sortOrder: int,
         *         target: string,
         *         title: string,
         *         type: string,
         *         url: ?string,
         *         children: list<mixed>
         *     }>
         * }> $mappedMenus
         */
        $mappedMenus = $menus
            ->map(fn (NavigationMenu $menu): array => $this->mapMenu($menu))
            ->values()
            ->all();

        return [
            'editorStateKey' => $this->buildEditorStateKey($menus),
            'menus' => $mappedMenus,
            'resourceCatalog' => [
                'page' => $this->buildPageResources(),
                'post' => $this->buildPostResources(),
                'post_category' => $this->buildPostCategoryResources(),
            ],
        ];
    }

    private function ensureDefaultMenusExist(): void
    {
        DB::transaction(function (): void {
            foreach ($this->defaultMenus() as $menuAttributes) {
                NavigationMenu::query()->firstOrCreate(
                    ['slug' => $menuAttributes['slug']],
                    $menuAttributes,
                );
            }
        });
    }

    /**
     * @return list<array{
     *     is_active: bool,
     *     location: string,
     *     name: string,
     *     slug: string
     * }>
     */
    private function defaultMenus(): array
    {
        return [
            [
                'name' => 'Header chính',
                'slug' => 'header-main',
                'location' => 'header',
                'is_active' => true,
            ],
            [
                'name' => 'Footer nhanh',
                'slug' => 'footer-quick-links',
                'location' => 'footer',
                'is_active' => true,
            ],
        ];
    }

    /**
     * @param  Collection<int, NavigationMenu>  $menus
     */
    private function buildEditorStateKey(Collection $menus): string
    {
        $latestTimestamp = $menus
            ->flatMap(function (NavigationMenu $menu): array {
                $timestamps = [$menu->updated_at === null ? 0 : $menu->updated_at->timestamp];

                foreach ($menu->items as $item) {
                    $timestamps[] = $item->updated_at === null ? 0 : $item->updated_at->timestamp;
                }

                return $timestamps;
            })
            ->max();

        return sprintf('%d-%d', $menus->count(), (int) ($latestTimestamp ?? 0));
    }

    /**
     * @return array{
     *     id: int,
     *     isActive: bool,
     *     location: string,
     *     name: string,
     *     slug: string,
     *     items: list<array{
     *         id: int,
     *         isActive: bool,
     *         linkableId: ?int,
     *         linkableType: ?string,
     *         menuId: int,
     *         parentId: ?int,
     *         sortOrder: int,
     *         target: string,
     *         title: string,
     *         type: string,
     *         url: ?string,
     *         children: list<mixed>
     *     }>
     * }
     */
    private function mapMenu(NavigationMenu $menu): array
    {
        $items = [];

        foreach ($menu->items as $item) {
            /** @var int $itemId */
            $itemId = $item->getKey();

            $items[] = [
                'id' => $itemId,
                'isActive' => $item->is_active,
                'linkableId' => $item->linkable_id,
                'linkableType' => $this->toFrontendLinkableType($item->linkable_type),
                'menuId' => $item->menu_id,
                'parentId' => $item->parent_id,
                'sortOrder' => $item->sort_order,
                'target' => $item->target,
                'title' => $item->title,
                'type' => $item->type,
                'url' => $item->url,
            ];
        }

        /** @var int $menuId */
        $menuId = $menu->getKey();

        return [
            'id' => $menuId,
            'isActive' => $menu->is_active,
            'location' => $menu->location,
            'name' => $menu->name,
            'slug' => $menu->slug,
            'items' => $this->buildTree($items, null),
        ];
    }

    /**
     * @param  list<array{
     *     id: int,
     *     isActive: bool,
     *     linkableId: ?int,
     *     linkableType: ?string,
     *     menuId: int,
     *     parentId: ?int,
     *     sortOrder: int,
     *     target: string,
     *     title: string,
     *     type: string,
     *     url: ?string
     * }>  $items
     * @return list<array{
     *     id: int,
     *     isActive: bool,
     *     linkableId: ?int,
     *     linkableType: ?string,
     *     menuId: int,
     *     parentId: ?int,
     *     sortOrder: int,
     *     target: string,
     *     title: string,
     *     type: string,
     *     url: ?string,
     *     children: list<mixed>
     * }>
     */
    private function buildTree(array $items, ?int $parentId): array
    {
        $children = array_values(array_filter(
            $items,
            fn (array $item): bool => $item['parentId'] === $parentId,
        ));

        usort($children, function (array $left, array $right): int {
            $sortOrderComparison = $left['sortOrder'] <=> $right['sortOrder'];

            if ($sortOrderComparison !== 0) {
                return $sortOrderComparison;
            }

            return $left['id'] <=> $right['id'];
        });

        return array_map(function (array $item) use ($items): array {
            return [
                ...$item,
                'children' => $this->buildTree($items, $item['id']),
            ];
        }, $children);
    }

    /**
     * @return list<array{id: int, label: string, meta: string, type: string}>
     */
    private function buildPageResources(): array
    {
        /** @var list<array{id: int, label: string, meta: string, type: string}> $resources */
        $resources = Page::query()
            ->where('status', 'published')
            ->orderBy('title')
            ->get()
            ->map(fn (Page $page): array => [
                'id' => $page->getKey(),
                'label' => $page->title,
                'meta' => '/'.$page->slug,
                'type' => 'page',
            ])
            ->values()
            ->all();

        return $resources;
    }

    /**
     * @return list<array{id: int, label: string, meta: string, type: string}>
     */
    private function buildPostResources(): array
    {
        /** @var list<array{id: int, label: string, meta: string, type: string}> $resources */
        $resources = Post::query()
            ->where('status', 'published')
            ->orderBy('title')
            ->get()
            ->map(fn (Post $post): array => [
                'id' => $post->getKey(),
                'label' => $post->title,
                'meta' => 'Bài viết published',
                'type' => 'post',
            ])
            ->values()
            ->all();

        return $resources;
    }

    /**
     * @return list<array{id: int, label: string, meta: string, type: string}>
     */
    private function buildPostCategoryResources(): array
    {
        /** @var list<array{id: int, label: string, meta: string, type: string}> $resources */
        $resources = PostCategory::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (PostCategory $category): array => [
                'id' => $category->getKey(),
                'label' => $category->name,
                'meta' => $category->parent_id === null ? 'Danh mục gốc' : 'Danh mục con',
                'type' => 'post_category',
            ])
            ->values()
            ->all();

        return $resources;
    }

    private function toFrontendLinkableType(?string $linkableType): ?string
    {
        return match ($linkableType) {
            PostCategory::class => 'post_category',
            Page::class => 'page',
            Post::class => 'post',
            default => null,
        };
    }
}
