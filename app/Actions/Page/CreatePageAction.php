<?php

declare(strict_types=1);

namespace App\Actions\Page;

use App\Actions\Content\SyncContentStudentGroupsAction;
use App\Events\CmsContentChanged;
use App\Models\Page;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreatePageAction
{
    public function __construct(
        private readonly SyncContentStudentGroupsAction $syncContentStudentGroups,
    ) {}

    /**
     * @param array{
     *     title: string,
     *     slug: string,
     *     excerpt?: ?string,
     *     seo_title?: ?string,
     *     seo_description?: ?string,
     *     content: string,
     *     content_format: string,
     *     visibility: string,
     *     student_group_ids?: list<int>,
     *     site_layout_id?: ?int,
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
                'visibility' => $attributes['visibility'],
                'site_layout_id' => $attributes['site_layout_id'] ?? null,
                'thumbnail_id' => $attributes['thumbnail_id'] ?? null,
                'author_id' => $author->getKey(),
                'status' => $attributes['status'],
            ]);

            ($this->syncContentStudentGroups)(
                $page,
                $attributes['visibility'] === 'student_groups'
                    ? ($attributes['student_group_ids'] ?? [])
                    : [],
            );

            event(CmsContentChanged::forPage($page, 'created', 'Đã tạo trang mới.'));

            return $page->fresh(['author']) ?? $page;
        });
    }
}
