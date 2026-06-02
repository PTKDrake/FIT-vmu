<?php

declare(strict_types=1);

namespace App\Actions\SiteLayout;

use App\Models\SiteLayout;
use Illuminate\Support\Facades\DB;

class CreateSiteLayoutAction
{
    /**
     * @param array{
     *     name: string,
     *     key: string,
     *     header_data?: ?string,
     *     footer_data?: ?string,
     *     left_data?: ?string,
     *     right_data?: ?string,
     *     status: string,
     *     is_default?: bool
     * } $attributes
     */
    public function __invoke(array $attributes): SiteLayout
    {
        return DB::transaction(function () use ($attributes): SiteLayout {
            if (($attributes['is_default'] ?? false) === true) {
                SiteLayout::query()->update(['is_default' => false]);
                $attributes['status'] = 'published';
            }

            /** @var SiteLayout $siteLayout */
            $siteLayout = SiteLayout::query()->create([
                'name' => $attributes['name'],
                'key' => $attributes['key'],
                'header_data' => $this->normalizeSlot($attributes['header_data'] ?? null),
                'footer_data' => $this->normalizeSlot($attributes['footer_data'] ?? null),
                'left_data' => $this->normalizeSlot($attributes['left_data'] ?? null),
                'right_data' => $this->normalizeSlot($attributes['right_data'] ?? null),
                'status' => $attributes['status'],
                'is_default' => $attributes['is_default'] ?? false,
            ]);

            return $siteLayout;
        });
    }

    private function normalizeSlot(?string $value): ?string
    {
        return $value === '' ? null : $value;
    }
}
