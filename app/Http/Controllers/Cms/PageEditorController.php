<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Carbon\CarbonInterface;
use Inertia\Response;

final class PageEditorController extends Controller
{
    public function __invoke(Page $page): Response
    {
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
                'status' => $page->status,
                'updatedAt' => $this->formatDateTime($page->updated_at) ?? now()->toAtomString(),
            ],
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
