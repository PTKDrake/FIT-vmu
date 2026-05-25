<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Position;
use Carbon\CarbonInterface;

class PositionData extends Data
{
    public function __construct(
        public string $name,
        public string $slug,
        public int $sortOrder,
        public bool $isActive,
        public ?CarbonInterface $createdAt = null,
        public ?CarbonInterface $updatedAt = null,
        public ?int $id = null,
    ) {}

    public static function fromModel(Position $position): self
    {
        return new self(
            name: $position->name,
            slug: $position->slug,
            sortOrder: $position->sort_order,
            isActive: $position->is_active,
            createdAt: self::normalizeDateTime($position->created_at),
            updatedAt: self::normalizeDateTime($position->updated_at),
            id: $position->id,
        );
    }
}
