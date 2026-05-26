<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\NavigationItem;
use Carbon\CarbonInterface;

class NavigationItemData extends Data
{
    public function __construct(
        public int $menuId,
        public string $title,
        public string $type,
        public string $target,
        public int $sortOrder,
        public bool $isActive,
        public ?int $parentId = null,
        public ?string $linkableType = null,
        public ?int $linkableId = null,
        public ?string $url = null,
        public ?CarbonInterface $createdAt = null,
        public ?CarbonInterface $updatedAt = null,
        public ?int $id = null,
    ) {}

    public static function fromModel(NavigationItem $navigationItem): self
    {
        return new self(
            menuId: $navigationItem->menu_id,
            title: $navigationItem->title,
            type: $navigationItem->type,
            target: $navigationItem->target,
            sortOrder: $navigationItem->sort_order,
            isActive: $navigationItem->is_active,
            parentId: $navigationItem->parent_id,
            linkableType: $navigationItem->linkable_type,
            linkableId: $navigationItem->linkable_id,
            url: $navigationItem->url,
            createdAt: self::normalizeDateTime($navigationItem->created_at),
            updatedAt: self::normalizeDateTime($navigationItem->updated_at),
            id: $navigationItem->id,
        );
    }
}
