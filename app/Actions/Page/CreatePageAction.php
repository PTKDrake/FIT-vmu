<?php

declare(strict_types=1);

namespace App\Actions\Page;

use App\Events\CmsContentChanged;
use App\Models\Page;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreatePageAction
{
    /**
     * @param array{
     *     title: string,
     *     slug: string,
     *     excerpt?: ?string,
     *     seo_title?: ?string,
     *     seo_description?: ?string,
     *     content: string,
     *     content_format: string,
     *     thumbnail_id?: ?int,
     *     status: string
     * } $attributes
     */
    public function __invoke(User $author, array $attributes): Page
    {
        return DB::transaction(function () use ($author, $attributes): Page {
            /** @var Page $page */
            $page = Page::query()->create([
                'title' => $attributes['title'],
                'slug' => $attributes['slug'],
                'excerpt' => $attributes['excerpt'] ?? null,
                'seo_title' => $attributes['seo_title'] ?? null,
                'seo_description' => $attributes['seo_description'] ?? null,
                'content' => $attributes['content'],
                'content_format' => $attributes['content_format'],
                'thumbnail_id' => $attributes['thumbnail_id'] ?? null,
                'author_id' => $author->getKey(),
                'status' => $attributes['status'],
            ]);

            event(CmsContentChanged::forPage($page, 'created', 'Đã tạo trang mới.'));

            return $page->fresh(['author']) ?? $page;
        });
    }
}
