<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\SiteLayout;
use Inertia\Response;

final class PageCreateController extends Controller
{
    public function __invoke(): Response
    {
        return inertia('cms/pages/create', [
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
        ]);
    }
}
