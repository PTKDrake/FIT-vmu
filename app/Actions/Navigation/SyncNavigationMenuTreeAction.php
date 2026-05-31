<?php

declare(strict_types=1);

namespace App\Actions\Navigation;

use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Support\Facades\DB;

class SyncNavigationMenuTreeAction
{
    /**
     * @param  list<array{
     *     id?: int|null,
     *     isActive: bool,
     *     linkableId: ?int,
     *     linkableType: ?string,
     *     target: string,
     *     title: string,
     *     type: string,
     *     url: ?string,
     *     children?: list<mixed>
     * }>  $items
     */
    public function __invoke(NavigationMenu $navigationMenu, array $items): void
    {
        DB::transaction(function () use ($navigationMenu, $items): void {
            $keptIds = [];

            $this->syncItems(
                navigationMenu: $navigationMenu,
                items: $items,
                parentId: null,
                keptIds: $keptIds,
            );

            $query = $navigationMenu->items();

            if ($keptIds === []) {
                $query->delete();

                return;
            }

            $query->whereNotIn('id', $keptIds)->delete();
        });
    }

    /**
     * @param  list<array{
     *     id?: int|null,
     *     isActive: bool,
     *     linkableId: ?int,
     *     linkableType: ?string,
     *     target: string,
     *     title: string,
     *     type: string,
     *     url: ?string,
     *     children?: list<mixed>
     * }>  $items
     * @param  list<int>  $keptIds
     */
    private function syncItems(
        NavigationMenu $navigationMenu,
        array $items,
        ?int $parentId,
        array &$keptIds,
    ): void {
        foreach ($items as $index => $payload) {
            $item = $this->resolveItem($navigationMenu, $payload['id'] ?? null) ?? new NavigationItem;

            $item->fill([
                'menu_id' => $navigationMenu->getKey(),
                'parent_id' => $parentId,
                'title' => $payload['title'],
                'type' => $payload['type'],
                'linkable_type' => $this->toModelLinkableType($payload['linkableType'] ?? null),
                'linkable_id' => $payload['linkableId'] ?? null,
                'url' => $payload['type'] === 'custom_url' ? $payload['url'] : null,
                'target' => $payload['target'],
                'sort_order' => $index + 1,
                'is_active' => $payload['isActive'],
            ]);
            $item->save();

            /** @var int $itemId */
            $itemId = $item->getKey();
            $keptIds[] = $itemId;

            /** @var list<array{
             *     id?: int|null,
             *     isActive: bool,
             *     linkableId: ?int,
             *     linkableType: ?string,
             *     target: string,
             *     title: string,
             *     type: string,
             *     url: ?string,
             *     children?: list<mixed>
             * }> $children
             */
            $children = $payload['children'] ?? [];

            $this->syncItems(
                navigationMenu: $navigationMenu,
                items: $children,
                parentId: $itemId,
                keptIds: $keptIds,
            );
        }
    }

    private function resolveItem(NavigationMenu $navigationMenu, mixed $itemId): ?NavigationItem
    {
        if (! is_int($itemId)) {
            return null;
        }

        return $navigationMenu->items()->whereKey($itemId)->first();
    }

    private function toModelLinkableType(?string $linkableType): ?string
    {
        return match ($linkableType) {
            'post_category' => PostCategory::class,
            'page' => Page::class,
            'post' => Post::class,
            default => null,
        };
    }
}
