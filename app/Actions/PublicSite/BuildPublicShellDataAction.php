<?php

declare(strict_types=1);

namespace App\Actions\PublicSite;

use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class BuildPublicShellDataAction
{
    /**
     * @return array{
     *     headerMenu: array<int, array<string, mixed>>,
     *     footerMenu: array<int, array<string, mixed>>,
     *     announcement: ?string
     * }
     */
    public function __invoke(): array
    {
        /** @var Collection<int, NavigationMenu> $menus */
        $menus = NavigationMenu::query()
            ->whereIn('location', ['header', 'footer'])
            ->where('is_active', true)
            ->with('items.linkable')
            ->orderBy('id')
            ->get()
            ->keyBy('location');

        return [
            'headerMenu' => $this->mapMenuItems($menus->get('header')),
            'footerMenu' => $this->mapMenuItems($menus->get('footer')),
            'announcement' => null,
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function mapMenuItems(?NavigationMenu $menu): array
    {
        if (! $menu instanceof NavigationMenu) {
            return [];
        }

        return $this->mapChildren($menu, $menu->items, null);
    }

    /**
     * @param  Collection<int, NavigationItem>  $items
     * @return array<int, array<string, mixed>>
     */
    private function mapChildren(
        NavigationMenu $menu,
        Collection $items,
        ?int $parentId,
    ): array {
        /** @var Collection<int, NavigationItem> $children */
        $children = $items
            ->filter(fn (NavigationItem $item): bool => $item->is_active
                && $item->parent_id === $parentId)
            ->sortBy([
                ['sort_order', 'asc'],
                ['id', 'asc'],
            ])
            ->values();

        return $children
            ->map(fn (NavigationItem $item): array => [
                'id' => $this->resolveModelKey($item),
                'menuId' => $this->resolveModelKey($menu),
                'title' => $item->title,
                'type' => $item->type,
                'target' => $item->target,
                'sortOrder' => $item->sort_order,
                'isActive' => $item->is_active,
                'parentId' => $item->parent_id,
                'linkableType' => $item->linkable_type,
                'linkableId' => $item->linkable_id,
                'url' => $item->url,
                'slug' => $this->resolveLinkableSlug($item->linkable),
                'children' => $this->mapChildren($menu, $items, $this->resolveModelKey($item)),
            ])
            ->values()
            ->all();
    }

    private function resolveLinkableSlug(?Model $linkable): ?string
    {
        if (! $linkable instanceof Model) {
            return null;
        }

        $slug = $linkable->getAttribute('slug');

        return is_string($slug) && $slug !== '' ? $slug : null;
    }

    private function resolveModelKey(Model $model): int
    {
        /** @var int $key */
        $key = $model->getKey();

        return $key;
    }
}
