<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Puck\BuildPuckDynamicDataAction;
use App\Models\Page;
use App\Models\SiteLayout;
use Inertia\Response;

final class PublicPageController extends Controller
{
    public function __invoke(Page $page, BuildPuckDynamicDataAction $buildPuckDynamicData): Response
    {
        abort_unless($page->status === 'published', 404);

        $page->load('siteLayout');
        $siteLayout = $this->resolveSiteLayout($page);

        return inertia('public/page', [
            'page' => [
                'id' => $page->getKey(),
                'title' => $page->title,
                'slug' => $page->slug,
                'excerpt' => $page->excerpt,
                'seoTitle' => $page->seo_title,
                'seoDescription' => $page->seo_description,
                'content' => $page->content,
                'contentFormat' => $page->content_format,
            ],
            'layout' => $siteLayout ? [
                'id' => $siteLayout->getKey(),
                'name' => $siteLayout->name,
                'key' => $siteLayout->key,
                'headerData' => $siteLayout->header_data,
                'footerData' => $siteLayout->footer_data,
                'leftData' => $siteLayout->left_data,
                'rightData' => $siteLayout->right_data,
            ] : null,
            'dynamicData' => $buildPuckDynamicData(),
        ]);
    }

    private function resolveSiteLayout(Page $page): ?SiteLayout
    {
        if ($page->siteLayout instanceof SiteLayout && $page->siteLayout->status === 'published') {
            return $page->siteLayout;
        }

        return SiteLayout::query()
            ->where('status', 'published')
            ->where('is_default', true)
            ->first();
    }
}
