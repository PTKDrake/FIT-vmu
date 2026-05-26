<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\PostCategory;
use Carbon\CarbonInterface;

class PostCategoryData extends Data
{
    public function __construct(
        public string $name,
        public string $slug,
        public int $sortOrder,
        public bool $isActive,
        public ?string $description = null,
        public ?int $parentId = null,
        public ?CarbonInterface $createdAt = null,
        public ?CarbonInterface $updatedAt = null,
        public ?int $id = null,
    ) {}

    public static function fromModel(PostCategory $postCategory): self
    {
        return new self(
            name: $postCategory->name,
            slug: $postCategory->slug,
            sortOrder: $postCategory->sort_order,
            isActive: $postCategory->is_active,
            description: $postCategory->description,
            parentId: $postCategory->parent_id,
            createdAt: self::normalizeDateTime($postCategory->created_at),
            updatedAt: self::normalizeDateTime($postCategory->updated_at),
            id: $postCategory->id,
        );
    }
}
