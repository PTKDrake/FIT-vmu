<?php

declare(strict_types=1);

namespace App\Actions\PostCategory;

use App\Models\PostCategory;
use Illuminate\Support\Facades\DB;

class CreatePostCategoryAction
{
    /**
     * @param  array{
     *     name: string,
     *     slug: string,
     *     description?: string|null,
     *     parent_id?: int|null,
     *     sort_order: int,
     *     is_active: bool,
     *     display_mode?: ?string,
     *     archive_template_key?: ?string,
     *     archive_template_data?: ?array<string, mixed>,
     *     post_template_key?: ?string,
     *     post_template_data?: ?array<string, mixed>
     * }  $attributes
     */
    public function __invoke(array $attributes): PostCategory
    {
        return DB::transaction(function () use ($attributes): PostCategory {
            return PostCategory::query()->create([
                'name' => $attributes['name'],
                'slug' => $attributes['slug'],
                'description' => $attributes['description'] ?? null,
                'parent_id' => $attributes['parent_id'] ?? null,
                'sort_order' => $attributes['sort_order'],
                'is_active' => $attributes['is_active'],
                'display_mode' => $attributes['display_mode'] ?? 'archive',
                'archive_template_key' => $attributes['archive_template_key'] ?? null,
                'archive_template_data' => $attributes['archive_template_data'] ?? null,
                'post_template_key' => $attributes['post_template_key'] ?? null,
                'post_template_data' => $attributes['post_template_data'] ?? null,
            ]);
        });
    }
}
