<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Post;
use Illuminate\Support\Carbon;
use Spatie\LaravelData\Lazy;

class PostData extends Data
{
    public function __construct(
        public string $title,
        public string $slug,
        public string $contentFormat,
        public string $status,
        public ?string $content = null,
        public ?string $excerpt = null,
        public ?int $thumbnailId = null,
        public ?int $authorId = null,
        public ?Carbon $publishedAt = null,
        public ?Carbon $createdAt = null,
        public ?Carbon $updatedAt = null,
        public ?int $id = null,
        public Lazy|MediaData|null $thumbnail = null,
    ) {}

    public static function fromModel(Post $post): self
    {
        return new self(
            title: $post->title,
            slug: $post->slug,
            contentFormat: $post->content_format,
            status: $post->status,
            content: $post->content,
            excerpt: $post->excerpt,
            thumbnailId: $post->thumbnail_id,
            authorId: $post->author_id,
            publishedAt: $post->published_at,
            createdAt: $post->created_at,
            updatedAt: $post->updated_at,
            id: $post->id,
            thumbnail: Lazy::whenLoaded(
                'thumbnail',
                $post,
                fn (): ?MediaData => $post->thumbnail ? MediaData::fromModel($post->thumbnail) : null,
            )->defaultIncluded(),
        );
    }
}
