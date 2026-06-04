<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\SiteLayout;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

final class UpdateSiteSettingsController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            SiteSetting::KEY_HOMEPAGE_PAGE => ['nullable', 'integer', Rule::exists((new Page)->getTable(), 'id')],
            SiteSetting::KEY_NOT_FOUND_PAGE => ['nullable', 'integer', Rule::exists((new Page)->getTable(), 'id')],
            SiteSetting::KEY_STUDENT_HOME_PAGE => ['nullable', 'integer', Rule::exists((new Page)->getTable(), 'id')],
            SiteSetting::KEY_DEFAULT_PAGE_LAYOUT => ['nullable', 'integer', Rule::exists((new SiteLayout)->getTable(), 'id')],
            SiteSetting::KEY_DEFAULT_CATEGORY_LAYOUT => ['nullable', 'integer', Rule::exists((new SiteLayout)->getTable(), 'id')],
            SiteSetting::KEY_DEFAULT_POST_LAYOUT => ['nullable', 'integer', Rule::exists((new SiteLayout)->getTable(), 'id')],
        ]);

        /** @var array<string, int|null> $validated */
        $allKeys = [
            SiteSetting::KEY_HOMEPAGE_PAGE,
            SiteSetting::KEY_NOT_FOUND_PAGE,
            SiteSetting::KEY_STUDENT_HOME_PAGE,
            SiteSetting::KEY_DEFAULT_PAGE_LAYOUT,
            SiteSetting::KEY_DEFAULT_CATEGORY_LAYOUT,
            SiteSetting::KEY_DEFAULT_POST_LAYOUT,
        ];

        foreach ($allKeys as $key) {
            SiteSetting::set($key, $validated[$key] ?? null);
        }

        return back();
    }
}
