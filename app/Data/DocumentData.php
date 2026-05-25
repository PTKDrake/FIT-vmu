<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Document;
use App\Models\Media;
use Carbon\CarbonInterface;
use Spatie\LaravelData\Lazy;

class DocumentData extends Data
{
    public function __construct(
        public string $title,
        public string $slug,
        public string $descriptionFormat,
        public string $documentType,
        public string $visibility,
        public string $status,
        public string $documentMode,
        public ?string $description = null,
        public ?int $fileId = null,
        public ?int $ownerId = null,
        public ?CarbonInterface $publishedAt = null,
        public ?CarbonInterface $createdAt = null,
        public ?CarbonInterface $updatedAt = null,
        public ?int $id = null,
        public Lazy|MediaData|null $file = null,
    ) {}

    public static function fromModel(Document $document): self
    {
        $file = $document->relationLoaded('file') ? $document->file : null;

        return new self(
            title: $document->title,
            slug: $document->slug,
            descriptionFormat: $document->description_format,
            documentType: $document->document_type,
            visibility: $document->visibility,
            status: $document->status,
            documentMode: $document->document_mode,
            description: $document->description,
            fileId: $document->file_id,
            ownerId: $document->owner_id,
            publishedAt: self::normalizeDateTime($document->published_at),
            createdAt: self::normalizeDateTime($document->created_at),
            updatedAt: self::normalizeDateTime($document->updated_at),
            id: $document->id,
            file: Lazy::whenLoaded(
                'file',
                $document,
                fn (): ?MediaData => $file instanceof Media ? MediaData::fromModel($file) : null,
            )->defaultIncluded(),
        );
    }
}
