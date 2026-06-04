<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\SiteLayout;
use App\Models\SiteSetting;
use Inertia\Response;

final class SiteSettingsIndexController extends Controller
{
    public function __invoke(): Response
    {
        return inertia('cms/settings/index', [
            'settings' => [
                'homepage_page' => SiteSetting::homepagePageId(),
                'not_found_page' => SiteSetting::notFoundPageId(),
                'student_home_page' => SiteSetting::studentHomePageId(),
                'default_page_layout' => SiteSetting::defaultPageLayoutId(),
                'default_category_layout' => SiteSetting::defaultCategoryLayoutId(),
                'default_post_layout' => SiteSetting::defaultPostLayoutId(),
            ],
            'pageOptions' => Page::query()
                ->where('status', 'published')
                ->orderBy('title')
                ->get(['id', 'title', 'slug'])
                ->map(fn (Page $page): array => [
                    'id' => $page->id,
                    'title' => $page->title,
                    'slug' => $page->slug,
                ])
                ->values()
                ->all(),
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
        ]);
    }
}
