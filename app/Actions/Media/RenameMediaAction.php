<?php

declare(strict_types=1);

namespace App\Actions\Media;

use App\Events\CmsContentChanged;
use App\Models\Media;

final class RenameMediaAction
{
    public function __invoke(Media $media, string $name): Media
    {
        $extension = pathinfo($media->display_name, PATHINFO_EXTENSION);
        $normalizedName = $this->normalizeName($name, $extension);
        $displayName = $extension !== ''
            ? $normalizedName.'.'.$extension
            : $normalizedName;

        $media->forceFill([
            'display_name' => $displayName,
        ])->save();

        event(CmsContentChanged::forResource(
            resource: 'media',
            recordId: $media->getKey(),
            title: $media->display_name,
            status: $media->mime_type,
            action: 'renamed',
            message: 'Đã đổi tên media.',
            updatedAt: $media->updated_at,
        ));

        return $media->refresh();
    }

    private function normalizeName(string $name, string $extension): string
    {
        $normalizedName = trim($name);

        if ($extension === '') {
            return $normalizedName;
        }

        $extensionSuffix = '.'.$extension;

        if (strtolower(substr($normalizedName, -strlen($extensionSuffix))) === strtolower($extensionSuffix)) {
            $normalizedName = substr($normalizedName, 0, -strlen($extensionSuffix));
        }

        return rtrim($normalizedName, " \t\n\r\0\x0B.");
    }
}
