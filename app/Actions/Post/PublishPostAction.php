<?php

declare(strict_types=1);

namespace App\Actions\Post;

use App\Events\CmsContentChanged;
use App\Models\Post;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PublishPostAction
{
    /**
     * @param  array{
     *     status: string,
     *     published_at?: string|null,
     *     rejection_reason?: string|null
     * }  $attributes
     */
    public function __invoke(Post $post, array $attributes, int $reviewerId): Post
    {
        return DB::transaction(function () use ($post, $attributes, $reviewerId): Post {
            /** @var Post $post */
            $post = Post::query()->findOrFail($post->getKey());

            $this->ensurePending($post);

            $post->update([
                'status' => $attributes['status'],
                'published_at' => $attributes['status'] === 'published' ? ($attributes['published_at'] ?? now()) : null,
                'reviewed_by_id' => $reviewerId,
                'reviewed_at' => now(),
                'rejection_reason' => $attributes['status'] === 'rejected'
                    ? ($attributes['rejection_reason'] ?? null)
                    : null,
            ]);

            event(CmsContentChanged::forPost(
                $post,
                $attributes['status'] === 'published' ? 'published' : 'rejected',
                $attributes['status'] === 'published'
                    ? 'Đã xuất bản bài viết.'
                    : 'Đã từ chối duyệt bài viết.',
            ));

            return $post->refresh();
        });
    }

    private function ensurePending(Post $post): void
    {
        if ($post->status === 'pending') {
            return;
        }

        throw ValidationException::withMessages([
            'status' => 'Chỉ bài viết đang chờ duyệt mới có thể được duyệt hoặc từ chối.',
        ]);
    }
}
