<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Page;
use App\Models\SiteLayout;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $homepage = Page::query()
            ->where('status', 'published')
            ->whereIn('slug', ['trang-chu-vmu', 'gioi-thieu-vmu'])
            ->orderByRaw("slug = 'trang-chu-vmu' desc")
            ->orderBy('id')
            ->first();

        $notFoundPage = Page::query()
            ->where('slug', '404')
            ->where('status', 'published')
            ->first();

        $studentHome = Page::query()
            ->where('status', 'published')
            ->whereIn('visibility', ['students', 'student_groups'])
            ->orderBy('id')
            ->first();

        $defaultPageLayout = SiteLayout::query()
            ->where('key', 'default-page-layout')
            ->first();

        $defaultPostLayout = SiteLayout::query()
            ->where('key', 'default-post-layout')
            ->first();

        SiteSetting::set(SiteSetting::KEY_HOMEPAGE_PAGE, $homepage?->getKey());
        SiteSetting::set(SiteSetting::KEY_NOT_FOUND_PAGE, $notFoundPage?->getKey());
        SiteSetting::set(SiteSetting::KEY_STUDENT_HOME_PAGE, $studentHome?->getKey());
        SiteSetting::set(SiteSetting::KEY_DEFAULT_PAGE_LAYOUT, $defaultPageLayout?->getKey());
        SiteSetting::set(SiteSetting::KEY_DEFAULT_CATEGORY_LAYOUT, $defaultPostLayout?->getKey());
        SiteSetting::set(SiteSetting::KEY_DEFAULT_POST_LAYOUT, $defaultPostLayout?->getKey());
    }
}
