<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Position;
use Illuminate\Support\Carbon;

class PositionData extends Data
{
    public function __construct(
        public string $name,
        public string $slug,
        public int $sortOrder,
        public bool $isActive,
        public ?Carbon $createdAt = null,
        public ?Carbon $updatedAt = null,
        public ?int $id = null,
    ) {}

    public static function fromModel(Position $position): self
    {
        return new self(
            name: $position->name,
            slug: $position->slug,
            sortOrder: $position->sort_order,
            isActive: $position->is_active,
            createdAt: $position->created_at,
            updatedAt: $position->updated_at,
            id: $position->id,
        );
    }
}
