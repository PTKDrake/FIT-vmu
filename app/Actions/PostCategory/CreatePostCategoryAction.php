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
     *     is_active: bool
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
            ]);
        });
    }
}
