<?php

declare(strict_types=1);

namespace App\Actions\Media;

use App\Models\Media;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class DeleteMediaAction
{
    public function __invoke(Media $media): void
    {
        $usageCount = $media->avatarStaffProfiles()->count()
            + $media->documentFiles()->count()
            + $media->postThumbnails()->count()
            + $media->pageThumbnails()->count();

        if ($usageCount > 0) {
            throw new RuntimeException('Media đang được sử dụng và chưa thể xóa.');
        }

        DB::transaction(function () use ($media): void {
            Storage::disk($media->disk)->delete($media->path);
            $media->delete();
        });
    }
}
