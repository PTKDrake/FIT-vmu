<?php

declare(strict_types=1);

namespace App\Actions\Post;

use App\Events\CmsContentChanged;
use App\Models\Post;
use Illuminate\Support\Facades\DB;

class UpdatePostAction
{
    /**
     * @param  array{
     *     title: string,
     *     slug: string,
     *     category_ids?: list<int>,
     *     excerpt?: string|null,
     *     content: string,
     *     content_format: string,
     *     template_key?: ?string,
     *     template_data?: ?array<string, mixed>,
     *     thumbnail_id?: int|null,
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
                'template_key' => $attributes['template_key'] ?? $post->template_key,
                'template_data' => $attributes['template_data'] ?? $post->template_data,
                'thumbnail_id' => $attributes['thumbnail_id'] ?? null,
                'status' => $attributes['status'],
                'published_at' => $attributes['status'] === 'published' && ! $post->published_at ? now() : $post->published_at,
            ]);

            $post->categories()->sync($attributes['category_ids'] ?? []);

            event(CmsContentChanged::forPost($post, 'updated', 'Đã cập nhật bài viết.'));

            return $post->refresh();
        });
    }
}
