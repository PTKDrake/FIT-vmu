<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\StudentGroup\BuildAccessibleStudentGroupOptionsAction;
use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\SiteLayout;
use Carbon\CarbonInterface;
use Inertia\Response;

final class PageEditorController extends Controller
{
    public function __invoke(Page $page, BuildAccessibleStudentGroupOptionsAction $buildStudentGroupOptions): Response
    {
        $page->loadMissing('studentGroups');

        return inertia('cms/pages/edit', [
            'page' => [
                'id' => $page->getKey(),
                'title' => $page->title,
                'slug' => $page->slug,
                'excerpt' => $page->excerpt,
                'seoTitle' => $page->seo_title,
                'seoDescription' => $page->seo_description,
                'content' => $page->content,
                'contentFormat' => $page->content_format,
                'visibility' => $page->visibility,
                'studentGroupIds' => $page->studentGroupIds(),
                'siteLayoutId' => $page->site_layout_id,
                'status' => $page->status,
                'updatedAt' => $this->formatDateTime($page->updated_at) ?? now()->toAtomString(),
            ],
            'layoutOptions' => SiteLayout::query()
                ->orderByDesc('is_default')
                ->orderBy('name')
                ->get(['id', 'name', 'key', 'status', 'is_default'])
                ->map(fn (SiteLayout $siteLayout): array => [
                    'id' => $siteLayout->id,
                    'name' => $siteLayout->name,
                    'key' => $siteLayout->key,
                    'status' => $siteLayout->status,
                    'isDefault' => $siteLayout->is_default,
                ])
                ->values()
                ->all(),
            'studentGroupOptions' => $buildStudentGroupOptions(request()->user()),
        ]);
    }

    private function formatDateTime(mixed $value): ?string
    {
        if ($value instanceof CarbonInterface) {
            return $value->toAtomString();
        }

        if (is_string($value) && $value !== '') {
            return $value;
        }

        return null;
    }
}
