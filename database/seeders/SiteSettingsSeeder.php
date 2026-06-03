<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Page;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = SiteSetting::current();

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

        $settings->update([
            'homepage_page_id' => $homepage?->getKey(),
            'not_found_page_id' => $notFoundPage?->getKey(),
            'student_home_page_id' => $studentHome?->getKey(),
        ]);
    }
}
