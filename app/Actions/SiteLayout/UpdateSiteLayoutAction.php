<?php

declare(strict_types=1);

namespace App\Actions\SiteLayout;

use App\Models\SiteLayout;

class UpdateSiteLayoutAction
{
    /**
     * @param array{
     *     name: string,
     *     key: string,
     *     header_data?: ?string,
     *     footer_data?: ?string,
     *     left_data?: ?string,
     *     right_data?: ?string,
     *     status: string
     * } $attributes
     */
    public function __invoke(SiteLayout $siteLayout, array $attributes): SiteLayout
    {
        $siteLayout->update([
            'name' => $attributes['name'],
            'key' => $attributes['key'],
            'header_data' => $this->normalizeSlot($attributes['header_data'] ?? null),
            'footer_data' => $this->normalizeSlot($attributes['footer_data'] ?? null),
            'left_data' => $this->normalizeSlot($attributes['left_data'] ?? null),
            'right_data' => $this->normalizeSlot($attributes['right_data'] ?? null),
            'status' => $attributes['status'],
        ]);

        return $siteLayout->fresh(['pages', 'postCategories', 'posts']) ?? $siteLayout;
    }

    private function normalizeSlot(?string $value): ?string
    {
        return $value === '' ? null : $value;
    }
}
