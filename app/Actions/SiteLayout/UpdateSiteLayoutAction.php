<?php

declare(strict_types=1);

namespace App\Actions\SiteLayout;

use App\Models\SiteLayout;

class UpdateSiteLayoutAction
{
    /**
     * @param array{
     *     name?: string,
     *     key?: string,
     *     header_data?: ?string,
     *     footer_data?: ?string,
     *     left_data?: ?string,
     *     right_data?: ?string
     * } $attributes
     */
    public function __invoke(SiteLayout $siteLayout, array $attributes): SiteLayout
    {
        $payload = [];

        if (array_key_exists('name', $attributes)) {
            $payload['name'] = $attributes['name'];
        }

        if (array_key_exists('key', $attributes)) {
            $payload['key'] = $attributes['key'];
        }

        foreach (['header_data', 'footer_data', 'left_data', 'right_data'] as $field) {
            if (! array_key_exists($field, $attributes)) {
                continue;
            }

            $payload[$field] = $this->normalizeSlot($attributes[$field]);
        }

        $siteLayout->update($payload);

        return $siteLayout->fresh(['pages', 'postCategories', 'posts']) ?? $siteLayout;
    }

    private function normalizeSlot(?string $value): ?string
    {
        return $value === '' ? null : $value;
    }
}
