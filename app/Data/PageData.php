<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Media;
use App\Models\Page;
use Carbon\CarbonInterface;
use Spatie\LaravelData\Lazy;

class PageData extends Data
{
    public function __construct(
        public string $title,
        public string $slug,
        public string $contentFormat,
        public string $status,
        public ?string $content = null,
        public ?string $excerpt = null,
        public ?string $seoTitle = null,
        public ?string $seoDescription = null,
        public ?string $templateKey = null,
        /** @var array<string, mixed>|null */
        public ?array $templateData = null,
        public ?int $thumbnailId = null,
        public ?int $authorId = null,
        public ?string $authorName = null,
        public ?CarbonInterface $publishedAt = null,
        public ?CarbonInterface $createdAt = null,
        public ?CarbonInterface $updatedAt = null,
        public ?int $id = null,
        public Lazy|MediaData|null $thumbnail = null,
    ) {}

    public static function fromModel(Page $page): self
    {
        $thumbnail = $page->relationLoaded('thumbnail') ? $page->thumbnail : null;

        return new self(
            title: $page->title,
            slug: $page->slug,
            contentFormat: $page->content_format,
            status: $page->status,
            content: $page->content,
            excerpt: $page->excerpt,
            seoTitle: $page->seo_title,
            seoDescription: $page->seo_description,
            templateKey: $page->template_key,
            templateData: self::normalizeArray($page->template_data),
            thumbnailId: $page->thumbnail_id,
            authorId: $page->author_id,
            authorName: $page->author?->name,
            publishedAt: self::normalizeDateTime($page->published_at),
            createdAt: self::normalizeDateTime($page->created_at),
            updatedAt: self::normalizeDateTime($page->updated_at),
            id: $page->id,
            thumbnail: Lazy::whenLoaded(
                'thumbnail',
                $page,
                fn (): ?MediaData => $thumbnail instanceof Media ? MediaData::fromModel($thumbnail) : null,
            )->defaultIncluded(),
        );
    }
}
