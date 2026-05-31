<?php

declare(strict_types=1);

namespace App\Actions\Navigation;

use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

class BuildNavigationMenusViewDataAction
{
    /**
     * @param  Collection<int, NavigationMenu>  $navigationMenus
     * @return array{
     *     data: array<int, array<string, mixed>>,
     *     version: string
     * }
     */
    public function __invoke(Collection $navigationMenus): array
    {
        $menus = $navigationMenus
            ->sortBy('name')
            ->values()
            ->map(fn (NavigationMenu $navigationMenu): array => $this->mapMenu($navigationMenu))
            ->all();

        return [
            'data' => $menus,
            'version' => $this->buildVersion($navigationMenus),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function mapMenu(NavigationMenu $navigationMenu): array
    {
        /** @var int $navigationMenuId */
        $navigationMenuId = $navigationMenu->getKey();

        return [
            'id' => $navigationMenuId,
            'isActive' => $navigationMenu->is_active,
            'location' => $navigationMenu->location,
            'name' => $navigationMenu->name,
            'slug' => $navigationMenu->slug,
            'items' => $this->buildItemTree($navigationMenu->items),
        ];
    }

    /**
     * @param  Collection<int, NavigationItem>  $items
     * @return array<int, array<string, mixed>>
     */
    private function buildItemTree(Collection $items, ?int $parentId = null): array
    {
        return $items
            ->filter(static fn (NavigationItem $item): bool => $item->parent_id === $parentId)
            ->sortBy([
                ['sort_order', 'asc'],
                ['id', 'asc'],
            ])
            ->values()
            ->map(function (NavigationItem $item) use ($items): array {
                /** @var int $itemId */
                $itemId = $item->getKey();
                /** @var int $menuId */
                $menuId = $item->menu_id;

                return [
                    'id' => $itemId,
                    'isActive' => $item->is_active,
                    'linkableId' => $item->linkable_id,
                    'linkableType' => $this->mapLinkableType($item->linkable_type),
                    'menuId' => $menuId,
                    'parentId' => $item->parent_id,
                    'sortOrder' => $item->sort_order,
                    'target' => $item->target,
                    'title' => $item->title,
                    'type' => $item->type,
                    'url' => $item->url,
                    'children' => $this->buildItemTree($items, $itemId),
                ];
            })
            ->all();
    }

    private function mapLinkableType(?string $linkableType): ?string
    {
        return match ($linkableType) {
            Page::class => 'page',
            Post::class => 'post',
            PostCategory::class => 'post_category',
            default => null,
        };
    }

    /**
     * @param  Collection<int, NavigationMenu>  $navigationMenus
     */
    private function buildVersion(Collection $navigationMenus): string
    {
        $latestUpdatedAt = $navigationMenus
            ->map(fn (NavigationMenu $navigationMenu): ?CarbonInterface => $this->normalizeDateTime($navigationMenu->updated_at))
            ->filter()
            ->sort()
            ->last();

        return $latestUpdatedAt?->toAtomString() ?? now()->toAtomString();
    }

    private function normalizeDateTime(mixed $value): ?CarbonInterface
    {
        return $value instanceof CarbonInterface ? $value : null;
    }
}
