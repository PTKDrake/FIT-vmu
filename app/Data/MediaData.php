<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Media;
use Illuminate\Support\Carbon;

class MediaData extends Data
{
    public function __construct(
        public string $disk,
        public string $path,
        public string $originalName,
        public string $mimeType,
        public int $size,
        public ?int $uploadedBy = null,
        public ?Carbon $createdAt = null,
        public ?Carbon $updatedAt = null,
        public ?int $id = null,
    ) {}

    public static function fromModel(Media $media): self
    {
        return new self(
            disk: $media->disk,
            path: $media->path,
            originalName: $media->original_name,
            mimeType: $media->mime_type,
            size: $media->size,
            uploadedBy: $media->uploaded_by,
            createdAt: $media->created_at,
            updatedAt: $media->updated_at,
            id: $media->id,
        );
    }
}
