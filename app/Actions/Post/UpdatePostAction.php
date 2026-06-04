<?php

declare(strict_types=1);

namespace App\Actions\Post;

use App\Actions\Content\SyncContentStudentGroupsAction;
use App\Events\CmsContentChanged;
use App\Models\Post;
use Illuminate\Support\Facades\DB;

class UpdatePostAction
{
    public function __construct(
        private readonly SyncContentStudentGroupsAction $syncContentStudentGroups,
    ) {}

    /**
     * @param  array{
     *     title: string,
     *     slug: string,
     *     category_ids?: list<int>,
     *     excerpt?: string|null,
     *     content: string,
     *     content_format: string,
     *     visibility: string,
     *     student_group_ids?: list<int>,
     *     thumbnail_id?: int|null,
     *     site_layout_id?: int|null,
     *     status: string
     * }  $attributes
     */
    public function __invoke(Post $post, array $attributes): Post
    {
        return DB::transaction(function () use ($post, $attributes): Post {
            $post->update([
                'title' => $attributes['title'],
                'slug' => $attributes['slug'],
                'excerpt' => $attributes['excerpt'] ?? null,
                'content' => $attributes['content'],
                'content_format' => $attributes['content_format'],
                'visibility' => $attributes['visibility'],
                'thumbnail_id' => $attributes['thumbnail_id'] ?? null,
                'site_layout_id' => $attributes['site_layout_id'] ?? null,
                'status' => $attributes['status'],
                'published_at' => $attributes['status'] === 'published' && ! $post->published_at ? now() : $post->published_at,
            ]);

            $post->categories()->sync($attributes['category_ids'] ?? []);
            ($this->syncContentStudentGroups)(
                $post,
                $attributes['visibility'] === 'student_groups'
                    ? ($attributes['student_group_ids'] ?? [])
                    : [],
            );

            event(CmsContentChanged::forPost($post, 'updated', 'Đã cập nhật bài viết.'));

            return $post->refresh();
        });
    }
}
