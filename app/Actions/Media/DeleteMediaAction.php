<?php

declare(strict_types=1);

namespace App\Actions\Media;

use App\Events\CmsContentChanged;
use App\Models\Media;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class DeleteMediaAction
{
    public function __invoke(Media $media): void
    {
        $usageCount = $media->avatarStaffProfiles()->count()
            + $media->postThumbnails()->count()
            + $media->pageThumbnails()->count();

        if ($usageCount > 0) {
            throw new RuntimeException('Media đang được sử dụng và chưa thể xóa.');
        }

        DB::transaction(function () use ($media): void {
            Storage::disk($media->disk)->delete($media->path);
            $media->delete();

            event(CmsContentChanged::forResource(
                resource: 'media',
                recordId: $media->getKey(),
                title: $media->display_name,
                status: $media->mime_type,
                action: 'deleted',
                message: 'Đã xóa media.',
                updatedAt: $media->updated_at,
            ));
        });
    }
}
