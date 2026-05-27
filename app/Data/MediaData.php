<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Media;
use Carbon\CarbonInterface;

class MediaData extends Data
{
    public function __construct(
        public string $disk,
        public string $path,
        public string $originalName,
        public string $displayName,
        public string $mimeType,
        public int $size,
        public ?int $uploadedBy = null,
        public ?CarbonInterface $createdAt = null,
        public ?CarbonInterface $updatedAt = null,
        public ?int $id = null,
    ) {}

    public static function fromModel(Media $media): self
    {
        return new self(
            disk: $media->disk,
            path: $media->path,
            originalName: $media->original_name,
            displayName: $media->display_name,
            mimeType: $media->mime_type,
            size: $media->size,
            uploadedBy: $media->uploaded_by,
            createdAt: self::normalizeDateTime($media->created_at),
            updatedAt: self::normalizeDateTime($media->updated_at),
            id: $media->id,
        );
    }
}
