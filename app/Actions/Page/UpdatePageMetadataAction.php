<?php

declare(strict_types=1);

namespace App\Actions\Page;

use App\Models\Page;
use Illuminate\Support\Facades\DB;

class UpdatePageMetadataAction
{
    /**
     * @param array{
     *     title: string,
     *     slug: string,
     *     excerpt?: ?string,
     *     seo_title?: ?string,
     *     seo_description?: ?string
     * } $attributes
     */
    public function __invoke(Page $page, array $attributes): Page
    {
        return DB::transaction(function () use ($page, $attributes): Page {
            $page->update([
                'title' => $attributes['title'],
                'slug' => $attributes['slug'],
                'excerpt' => $attributes['excerpt'] ?? null,
                'seo_title' => $attributes['seo_title'] ?? null,
                'seo_description' => $attributes['seo_description'] ?? null,
            ]);

            return $page->fresh(['author']) ?? $page;
        });
    }
}
