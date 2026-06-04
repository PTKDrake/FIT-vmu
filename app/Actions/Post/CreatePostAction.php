<?php

declare(strict_types=1);

namespace App\Actions\Post;

use App\Actions\Content\SyncContentStudentGroupsAction;
use App\Events\CmsContentChanged;
use App\Models\Post;
use Illuminate\Support\Facades\DB;

class CreatePostAction
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
    public function __invoke(array $attributes, int $authorId): Post
    {
        return DB::transaction(function () use ($attributes, $authorId): Post {
            $post = Post::query()->create([
                'title' => $attributes['title'],
                'slug' => $attributes['slug'],
                'excerpt' => $attributes['excerpt'] ?? null,
                'content' => $attributes['content'],
                'content_format' => $attributes['content_format'],
                'visibility' => $attributes['visibility'],
                'thumbnail_id' => $attributes['thumbnail_id'] ?? null,
                'site_layout_id' => $attributes['site_layout_id'] ?? null,
                'author_id' => $authorId,
                'status' => $attributes['status'],
                'published_at' => $attributes['status'] === 'published' ? now() : null,
            ]);

            $post->categories()->sync($attributes['category_ids'] ?? []);
            ($this->syncContentStudentGroups)(
                $post,
                $attributes['visibility'] === 'student_groups'
                    ? ($attributes['student_group_ids'] ?? [])
                    : [],
            );

            event(CmsContentChanged::forPost($post, 'created', 'Đã tạo bài viết mới.'));

            return $post->refresh();
        });
    }
}
