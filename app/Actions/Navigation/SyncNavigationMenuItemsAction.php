<?php

declare(strict_types=1);

namespace App\Actions\Navigation;

use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Support\Facades\DB;

class SyncNavigationMenuItemsAction
{
    /**
     * @param list<array{
     *     id: int,
     *     parent_id: int|null,
     *     title: string,
     *     type: 'custom_url'|'post_category'|'page'|'post'|'unit',
     *     linkable_type: 'post_category'|'page'|'post'|null,
     *     linkable_id: int|null,
     *     url: string|null,
     *     target: '_self'|'_blank',
     *     sort_order: int,
     *     is_active: bool
     * }> $items
     */
    public function __invoke(NavigationMenu $navigationMenu, array $items): NavigationMenu
    {
        return DB::transaction(function () use ($navigationMenu, $items): NavigationMenu {
            NavigationItem::query()
                ->where('menu_id', $navigationMenu->getKey())
                ->delete();

            /** @var array<string, array<int, array{
             *     id: int,
             *     parent_id: int|null,
             *     title: string,
             *     type: 'custom_url'|'post_category'|'page'|'post',
             *     linkable_type: 'post_category'|'page'|'post'|null,
             *     linkable_id: int|null,
             *     url: string|null,
             *     target: '_self'|'_blank',
             *     sort_order: int,
             *     is_active: bool
             * }>> $itemsByParentId */
            $itemsByParentId = [];

            foreach ($items as $item) {
                $itemsByParentId[self::groupKey($item['parent_id'])][] = $item;
            }

            $this->createTree($navigationMenu, $itemsByParentId);

            $navigationMenu->touch();

            return $navigationMenu->fresh(['items']) ?? $navigationMenu;
        });
    }

    /**
     * @param array<string, array<int, array{
     *     id: int,
     *     parent_id: int|null,
     *     title: string,
     *     type: 'custom_url'|'post_category'|'page'|'post'|'unit',
     *     linkable_type: 'post_category'|'page'|'post'|null,
     *     linkable_id: int|null,
     *     url: string|null,
     *     target: '_self'|'_blank',
     *     sort_order: int,
     *     is_active: bool
     * }>> $itemsByParentId
     */
    private function createTree(NavigationMenu $navigationMenu, array $itemsByParentId, ?int $parentItemId = null, ?int $parentClientId = null): void
    {
        $items = $itemsByParentId[self::groupKey($parentClientId)] ?? [];

        usort($items, static fn (array $left, array $right): int => [$left['sort_order'], $left['id']] <=> [$right['sort_order'], $right['id']]);

        foreach ($items as $item) {
            /** @var array{
             *     id: int,
             *     parent_id: int|null,
             *     title: string,
             *     type: 'custom_url'|'post_category'|'page'|'post'|'unit',
             *     linkable_type: 'post_category'|'page'|'post'|null,
             *     linkable_id: int|null,
             *     url: string|null,
             *     target: '_self'|'_blank',
             *     sort_order: int,
             *     is_active: bool
             * } $item */
            $createdItem = $navigationMenu->items()->create([
                'parent_id' => $parentItemId,
                'title' => $item['title'],
                'type' => $item['type'],
                'linkable_type' => $this->mapLinkableType($item['linkable_type']),
                'linkable_id' => $item['linkable_id'],
                'url' => $item['url'],
                'target' => $item['target'],
                'sort_order' => $item['sort_order'],
                'is_active' => $item['is_active'],
            ]);

            /** @var int $createdItemId */
            $createdItemId = $createdItem->getKey();

            $this->createTree(
                $navigationMenu,
                $itemsByParentId,
                $createdItemId,
                $item['id'],
            );
        }
    }

    private static function groupKey(?int $parentId): string
    {
        return $parentId === null ? 'root' : (string) $parentId;
    }

    private function mapLinkableType(?string $linkableType): ?string
    {
        return match ($linkableType) {
            'page' => Page::class,
            'post' => Post::class,
            'post_category' => PostCategory::class,
            default => null,
        };
    }
}
