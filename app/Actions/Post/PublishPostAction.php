<?php

declare(strict_types=1);

namespace App\Actions\Post;

use App\Models\Post;
use Illuminate\Support\Facades\DB;

class PublishPostAction
{
    /**
     * @param  array{
     *     status: string,
     *     published_at?: string|null
     * }  $attributes
     */
    public function __invoke(Post $post, array $attributes): Post
    {
        return DB::transaction(function () use ($post, $attributes): Post {
            $post->update([
                'status' => $attributes['status'],
                'published_at' => $attributes['status'] === 'published' ? ($attributes['published_at'] ?? now()) : null,
            ]);

            return $post->refresh();
        });
    }
}
