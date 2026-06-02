<?php

declare(strict_types=1);

namespace App\Actions\Page;

use App\Events\CmsContentChanged;
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
     *     seo_description?: ?string,
     *     site_layout_id?: ?int
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
                'site_layout_id' => $attributes['site_layout_id'] ?? null,
            ]);

            event(CmsContentChanged::forPage($page, 'metadata-updated', 'Đã cập nhật thông tin trang.'));

            return $page->fresh(['author']) ?? $page;
        });
    }
}
