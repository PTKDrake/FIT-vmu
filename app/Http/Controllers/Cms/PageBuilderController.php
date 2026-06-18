<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Puck\BuildPuckDynamicDataAction;
use App\Http\Controllers\Controller;
use App\Models\Page;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Inertia\Response;

final class PageBuilderController extends Controller
{
    public function __invoke(Request $request, Page $page, BuildPuckDynamicDataAction $buildPuckDynamicData): Response
    {
        return inertia('cms/pages/builder', [
            'can' => [
                'exportPuckJson' => $request->user()?->can('export puck json') ?? false,
            ],
            'page' => [
                'id' => $page->getKey(),
                'title' => $page->title,
                'slug' => $page->slug,
                'content' => $page->content,
                'contentFormat' => $page->content_format,
                'updatedAt' => $this->formatDateTime($page->updated_at) ?? now()->toAtomString(),
            ],
            'dynamicData' => $buildPuckDynamicData($request->user(), false, [$page->content]),
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
