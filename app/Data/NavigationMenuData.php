<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\NavigationMenu;
use Carbon\CarbonInterface;

class NavigationMenuData extends Data
{
    public function __construct(
        public string $name,
        public string $slug,
        public string $location,
        public bool $isActive,
        public ?CarbonInterface $createdAt = null,
        public ?CarbonInterface $updatedAt = null,
        public ?int $id = null,
    ) {}

    public static function fromModel(NavigationMenu $navigationMenu): self
    {
        return new self(
            name: $navigationMenu->name,
            slug: $navigationMenu->slug,
            location: $navigationMenu->location,
            isActive: $navigationMenu->is_active,
            createdAt: self::normalizeDateTime($navigationMenu->created_at),
            updatedAt: self::normalizeDateTime($navigationMenu->updated_at),
            id: $navigationMenu->id,
        );
    }
}
