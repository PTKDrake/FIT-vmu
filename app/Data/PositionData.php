<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Position;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;

class PositionData extends Data
{
    public function __construct(
        public ?int $id,
        public string $name,
        public ?string $slug,
        public int $sortOrder,
        public bool $isActive,
        public ?CarbonImmutable $createdAt,
        public ?CarbonImmutable $updatedAt,
    ) {}

    public static function fromModel(Position $position): self
    {
        return new self(
            id: $position->id,
            name: $position->name,
            slug: $position->slug,
            sortOrder: $position->sort_order,
            isActive: $position->is_active,
            createdAt: $position->created_at?->toImmutable(),
            updatedAt: $position->updated_at?->toImmutable(),
        );
    }
}
