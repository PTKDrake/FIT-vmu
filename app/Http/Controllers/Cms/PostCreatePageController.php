<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\StudentGroup\BuildAccessibleStudentGroupOptionsAction;
use App\Http\Controllers\Controller;
use App\Models\PostCategory;
use App\Models\SiteLayout;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Response;

final class PostCreatePageController extends Controller
{
    public function __invoke(Request $request, BuildAccessibleStudentGroupOptionsAction $buildStudentGroupOptions): Response
    {
        $categories = PostCategory::query()
            ->select(['id', 'name'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (PostCategory $cat): array => [
                'value' => (string) $cat->id,
                'label' => $cat->name,
            ])
            ->all();

        return inertia('cms/posts/create', [
            'categories' => $categories,
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
            'defaultPostLayoutId' => SiteSetting::defaultPostLayoutId(),
            'studentGroupOptions' => $buildStudentGroupOptions($request->user()),
        ]);
    }
}
