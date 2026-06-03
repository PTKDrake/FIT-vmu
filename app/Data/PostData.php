<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Media;
use App\Models\Post;
use Carbon\CarbonInterface;
use Spatie\LaravelData\Lazy;

class PostData extends Data
{
    public function __construct(
        public string $title,
        public string $slug,
        public string $contentFormat,
        public string $status,
        public string $visibility,
        public ?string $content = null,
        public ?string $excerpt = null,
        public ?int $thumbnailId = null,
        public ?int $authorId = null,
        public ?CarbonInterface $publishedAt = null,
        public ?CarbonInterface $createdAt = null,
        public ?CarbonInterface $updatedAt = null,
        public ?int $id = null,
        public Lazy|MediaData|null $thumbnail = null,
    ) {}

    public static function fromModel(Post $post): self
    {
        $thumbnail = $post->relationLoaded('thumbnail') ? $post->thumbnail : null;

        return new self(
            title: $post->title,
            slug: $post->slug,
            contentFormat: $post->content_format,
            status: $post->status,
            visibility: $post->visibility,
            content: $post->content,
            excerpt: $post->excerpt,
            thumbnailId: $post->thumbnail_id,
            authorId: $post->author_id,
            publishedAt: self::normalizeDateTime($post->published_at),
            createdAt: self::normalizeDateTime($post->created_at),
            updatedAt: self::normalizeDateTime($post->updated_at),
            id: $post->id,
            thumbnail: Lazy::whenLoaded(
                'thumbnail',
                $post,
                fn (): ?MediaData => $thumbnail instanceof Media ? MediaData::fromModel($thumbnail) : null,
            )->defaultIncluded(),
        );
    }
}
