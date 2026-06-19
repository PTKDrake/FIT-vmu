<?php

declare(strict_types=1);

namespace App\Actions\PostCategory;

use App\Events\CmsContentChanged;
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
     *     site_layout_id?: int|null
     * }  $attributes
     */
    public function __invoke(array $attributes): PostCategory
    {
        return DB::transaction(function () use ($attributes): PostCategory {
            $postCategory = PostCategory::query()->create([
                'name' => $attributes['name'],
                'slug' => $attributes['slug'],
                'description' => $attributes['description'] ?? null,
                'parent_id' => $attributes['parent_id'] ?? null,
                'sort_order' => $attributes['sort_order'],
                'is_active' => $attributes['is_active'],
                'site_layout_id' => $attributes['site_layout_id'] ?? null,
            ]);

            event(CmsContentChanged::forResource(
                resource: 'post-categories',
                recordId: $postCategory->getKey(),
                title: $postCategory->name,
                status: $postCategory->is_active ? 'active' : 'inactive',
                action: 'created',
                message: 'Đã tạo danh mục bài viết.',
                updatedAt: $postCategory->updated_at,
            ));

            return $postCategory;
        });
    }
}
