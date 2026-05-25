<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Unit;
use Carbon\CarbonInterface;

class UnitData extends Data
{
    public function __construct(
        public string $name,
        public string $slug,
        public string $type,
        public string $descriptionFormat,
        public int $sortOrder,
        public bool $isActive,
        public ?string $description = null,
        public ?CarbonInterface $createdAt = null,
        public ?CarbonInterface $updatedAt = null,
        public ?int $id = null,
    ) {}

    public static function fromModel(Unit $unit): self
    {
        return new self(
            name: $unit->name,
            slug: $unit->slug,
            type: $unit->type,
            descriptionFormat: $unit->description_format,
            sortOrder: $unit->sort_order,
            isActive: $unit->is_active,
            description: $unit->description,
            createdAt: self::normalizeDateTime($unit->created_at),
            updatedAt: self::normalizeDateTime($unit->updated_at),
            id: $unit->id,
        );
    }
}
