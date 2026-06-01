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
        public ?string $content = null,
        public ?string $excerpt = null,
        public ?string $templateKey = null,
        /** @var array<string, mixed>|null */
        public ?array $templateData = null,
        public ?int $thumbnailId = null,
        public ?int $authorId = null,
        public ?string $authorName = null,
        public ?string $reviewerName = null,
        public ?CarbonInterface $publishedAt = null,
        public ?CarbonInterface $reviewedAt = null,
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
            content: $post->content,
            excerpt: $post->excerpt,
            templateKey: $post->template_key,
            templateData: self::normalizeArray($post->template_data),
            thumbnailId: $post->thumbnail_id,
            authorId: $post->author_id,
            authorName: $post->author?->name,
            reviewerName: $post->reviewer?->name,
            publishedAt: self::normalizeDateTime($post->published_at),
            reviewedAt: self::normalizeDateTime($post->reviewed_at),
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
