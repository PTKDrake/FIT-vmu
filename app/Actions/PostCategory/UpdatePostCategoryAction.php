<?php

declare(strict_types=1);

namespace App\Actions\PostCategory;

use App\Models\PostCategory;
use Illuminate\Support\Facades\DB;

class UpdatePostCategoryAction
{
    /**
     * @param  array{
     *     name: string,
     *     slug: string,
     *     description?: string|null,
     *     parent_id?: int|null,
     *     sort_order: int,
     *     is_active: bool,
     *     site_layout_id?: int|null
     * }  $attributes
     */
    public function __invoke(PostCategory $postCategory, array $attributes): PostCategory
    {
        return DB::transaction(function () use ($postCategory, $attributes): PostCategory {
            $postCategory->update([
                'name' => $attributes['name'],
                'slug' => $attributes['slug'],
                'description' => $attributes['description'] ?? null,
                'parent_id' => $attributes['parent_id'] ?? null,
                'sort_order' => $attributes['sort_order'],
                'is_active' => $attributes['is_active'],
                'site_layout_id' => $attributes['site_layout_id'] ?? null,
            ]);

            return $postCategory->refresh();
        });
    }
}
