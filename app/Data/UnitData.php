<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Unit;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;

class UnitData extends Data
{
    public function __construct(
        public ?int $id,
        public string $name,
        public ?string $slug,
        public string $type,
        public ?string $description,
        public string $descriptionFormat,
        public int $sortOrder,
        public bool $isActive,
        public ?CarbonImmutable $createdAt,
        public ?CarbonImmutable $updatedAt,
    ) {}

    public static function fromModel(Unit $unit): self
    {
        return new self(
            id: $unit->id,
            name: $unit->name,
            slug: $unit->slug,
            type: $unit->type,
            description: $unit->description,
            descriptionFormat: $unit->description_format,
            sortOrder: $unit->sort_order,
            isActive: $unit->is_active,
            createdAt: $unit->created_at?->toImmutable(),
            updatedAt: $unit->updated_at?->toImmutable(),
        );
    }
}
