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
        public ?string $displayMode = null,
        public ?string $archiveTemplateKey = null,
        /** @var array<string, mixed>|null */
        public ?array $archiveTemplateData = null,
        public ?string $postTemplateKey = null,
        /** @var array<string, mixed>|null */
        public ?array $postTemplateData = null,
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
            displayMode: $postCategory->display_mode,
            archiveTemplateKey: $postCategory->archive_template_key,
            archiveTemplateData: self::normalizeArray($postCategory->archive_template_data),
            postTemplateKey: $postCategory->post_template_key,
            postTemplateData: self::normalizeArray($postCategory->post_template_data),
            createdAt: self::normalizeDateTime($postCategory->created_at),
            updatedAt: self::normalizeDateTime($postCategory->updated_at),
            id: $postCategory->id,
        );
    }
}
