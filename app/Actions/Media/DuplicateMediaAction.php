<?php

declare(strict_types=1);

namespace App\Actions\Media;

use App\Models\Media;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

final class DuplicateMediaAction
{
    public function __invoke(Media $media, User $user): Media
    {
        return DB::transaction(function () use ($media, $user): Media {
            $disk = Storage::disk($media->disk);
            $duplicateStorageName = $this->generateStorageName($media->original_name);
            $duplicatePath = $this->generateDuplicatePath($media->path, $duplicateStorageName);

            if (! $disk->copy($media->path, $duplicatePath)) {
                throw new RuntimeException('Không thể tạo bản sao media.');
            }

            /** @var Media $duplicate */
            $duplicate = Media::query()->create([
                'disk' => $media->disk,
                'path' => $duplicatePath,
                'original_name' => $duplicateStorageName,
                'display_name' => $this->generateDuplicateDisplayName($media->display_name),
                'mime_type' => $media->mime_type,
                'size' => $media->size,
                'uploaded_by' => $user->getKey(),
            ]);

            return $duplicate->fresh(['uploadedBy']) ?? $duplicate;
        });
    }

    private function generateDuplicateDisplayName(string $displayName): string
    {
        $extension = pathinfo($displayName, PATHINFO_EXTENSION);
        $baseName = pathinfo($displayName, PATHINFO_FILENAME);
        $duplicateBaseName = $baseName.' - Copy';

        return $extension !== ''
            ? $duplicateBaseName.'.'.$extension
            : $duplicateBaseName;
    }

    private function generateDuplicatePath(string $path, string $storageName): string
    {
        $directory = pathinfo($path, PATHINFO_DIRNAME);

        return $directory !== '' && $directory !== '.'
            ? $directory.'/'.$storageName
            : $storageName;
    }

    private function generateStorageName(string $originalName): string
    {
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);

        return $extension !== ''
            ? Str::lower((string) Str::ulid()).'.'.$extension
            : Str::lower((string) Str::ulid());
    }
}
