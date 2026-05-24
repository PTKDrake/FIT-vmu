<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Document;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;

class DocumentData extends Data
{
    public function __construct(
        public ?int $id,
        public string $title,
        public ?string $slug,
        public ?string $description,
        public string $descriptionFormat,
        public ?int $fileId,
        public ?int $ownerId,
        public string $documentType,
        public string $visibility,
        public string $status,
        public string $documentMode,
        public ?CarbonImmutable $publishedAt,
        public ?CarbonImmutable $createdAt,
        public ?CarbonImmutable $updatedAt,
    ) {}

    public static function fromModel(Document $document): self
    {
        return new self(
            id: $document->id,
            title: $document->title,
            slug: $document->slug,
            description: $document->description,
            descriptionFormat: $document->description_format,
            fileId: $document->file_id,
            ownerId: $document->owner_id,
            documentType: $document->document_type,
            visibility: $document->visibility,
            status: $document->status,
            documentMode: $document->document_mode,
            publishedAt: $document->published_at?->toImmutable(),
            createdAt: $document->created_at?->toImmutable(),
            updatedAt: $document->updated_at?->toImmutable(),
        );
    }
}
