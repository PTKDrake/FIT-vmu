<?php

declare(strict_types=1);

namespace App\Actions\Post;

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
                'thumbnail_id' => $attributes['thumbnail_id'] ?? null,
                'status' => $attributes['status'],
                'published_at' => $attributes['status'] === 'published' && ! $post->published_at ? now() : $post->published_at,
            ]);

            $post->categories()->sync($attributes['category_ids'] ?? []);

            return $post->refresh();
        });
    }
}
