<?php

declare(strict_types=1);

namespace App\Actions\PublicSite;

use App\Models\SiteLayout;

final class PublicLayoutResolver
{
    /**
     * @return array{id: int, name: string, key: string, headerData: mixed, footerData: mixed, leftData: mixed, rightData: mixed}|null
     */
    public static function resolve(?SiteLayout $recordLayout, ?int $defaultId): ?array
    {
        $layout = null;

        if ($recordLayout instanceof SiteLayout) {
            $layout = $recordLayout;
        } elseif ($defaultId !== null) {
            $layout = SiteLayout::query()
                ->where('id', $defaultId)
                ->first();
        }

        if (! $layout instanceof SiteLayout) {
            return null;
        }

        return [
            'id' => $layout->id,
            'name' => $layout->name,
            'key' => $layout->key,
            'headerData' => $layout->header_data,
            'footerData' => $layout->footer_data,
            'leftData' => $layout->left_data,
            'rightData' => $layout->right_data,
        ];
    }
}
