<?php

declare(strict_types=1);

namespace App\Actions\Post;

use App\Models\Post;
use Illuminate\Support\Facades\DB;

class CreatePostAction
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
    public function __invoke(array $attributes, int $authorId): Post
    {
        return DB::transaction(function () use ($attributes, $authorId): Post {
            $post = Post::query()->create([
                'title' => $attributes['title'],
                'slug' => $attributes['slug'],
                'excerpt' => $attributes['excerpt'] ?? null,
                'content' => $attributes['content'],
                'content_format' => $attributes['content_format'],
                'thumbnail_id' => $attributes['thumbnail_id'] ?? null,
                'author_id' => $authorId,
                'status' => $attributes['status'],
                'published_at' => $attributes['status'] === 'published' ? now() : null,
            ]);

            $post->categories()->sync($attributes['category_ids'] ?? []);

            return $post->refresh();
        });
    }
}
