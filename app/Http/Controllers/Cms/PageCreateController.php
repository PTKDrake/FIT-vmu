<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\StudentGroup\BuildAccessibleStudentGroupOptionsAction;
use App\Http\Controllers\Controller;
use App\Models\SiteLayout;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Response;

final class PageCreateController extends Controller
{
    public function __invoke(Request $request, BuildAccessibleStudentGroupOptionsAction $buildStudentGroupOptions): Response
    {
        return inertia('cms/pages/create', [
            'layoutOptions' => SiteLayout::query()
                ->orderBy('name')
                ->get(['id', 'name', 'key'])
                ->map(fn (SiteLayout $siteLayout): array => [
                    'id' => $siteLayout->id,
                    'name' => $siteLayout->name,
                    'key' => $siteLayout->key,
                ])
                ->values()
                ->all(),
            'defaultPageLayoutId' => SiteSetting::defaultPageLayoutId(),
            'studentGroupOptions' => $buildStudentGroupOptions($request->user()),
        ]);
    }
}
