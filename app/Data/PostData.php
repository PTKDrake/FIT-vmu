<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Post;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;

class PostData extends Data
{
    public function __construct(
        public ?int $id,
        public string $title,
        public ?string $slug,
        public ?string $excerpt,
        public ?string $content,
        public string $contentFormat,
        public ?int $thumbnailId,
        public ?int $authorId,
        public string $status,
        public ?CarbonImmutable $publishedAt,
        public ?CarbonImmutable $createdAt,
        public ?CarbonImmutable $updatedAt,
    ) {}

    public static function fromModel(Post $post): self
    {
        return new self(
            id: $post->id,
            title: $post->title,
            slug: $post->slug,
            excerpt: $post->excerpt,
            content: $post->content,
            contentFormat: $post->content_format,
            thumbnailId: $post->thumbnail_id,
            authorId: $post->author_id,
            status: $post->status,
            publishedAt: $post->published_at?->toImmutable(),
            createdAt: $post->created_at?->toImmutable(),
            updatedAt: $post->updated_at?->toImmutable(),
        );
    }
}
