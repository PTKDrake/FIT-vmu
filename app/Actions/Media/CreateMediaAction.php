<?php

declare(strict_types=1);

namespace App\Actions\Media;

use App\Events\CmsContentChanged;
use App\Models\Media;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateMediaAction
{
    public function __invoke(User $user, UploadedFile $file, string $disk = 'public'): Media
    {
        return DB::transaction(function () use ($user, $file, $disk): Media {
            $directory = 'media/'.now()->format('Y/m');
            $storageName = $this->generateStorageName($file);
            $path = $file->storeAs($directory, $storageName, $disk);

            /** @var Media $media */
            $media = Media::query()->create([
                'disk' => $disk,
                'path' => $path,
                'original_name' => $storageName,
                'display_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType() ?? 'application/octet-stream',
                'size' => $file->getSize() ?: 0,
                'uploaded_by' => $user->getKey(),
            ]);

            event(CmsContentChanged::forResource(
                resource: 'media',
                recordId: $media->getKey(),
                title: $media->display_name,
                status: $media->mime_type,
                action: 'created',
                message: 'Đã tải media lên.',
                updatedAt: $media->updated_at,
            ));

            return $media->fresh(['uploadedBy']) ?? $media;
        });
    }

    private function generateStorageName(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension());

        return $extension !== ''
            ? Str::lower((string) Str::ulid()).'.'.$extension
            : Str::lower((string) Str::ulid());
    }
}
