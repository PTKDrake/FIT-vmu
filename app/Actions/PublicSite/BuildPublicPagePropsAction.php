<?php

declare(strict_types=1);

namespace App\Actions\PublicSite;

use App\Actions\Puck\BuildPuckDynamicDataAction;
use App\Models\Page;
use App\Models\SiteLayout;
use App\Models\User;

class BuildPublicPagePropsAction
{
    public function __construct(
        private readonly BuildPuckDynamicDataAction $buildPuckDynamicData,
    ) {}

    /**
     * @return array{
     *     page: array{
     *         id: int,
     *         title: string,
     *         slug: string,
     *         excerpt: ?string,
     *         seoTitle: ?string,
     *         seoDescription: ?string,
     *         content: ?string,
     *         contentFormat: string,
     *         visibility: string
     *     },
     *     layout: array{
     *         id: int,
     *         name: string,
     *         key: string,
     *         headerData: mixed,
     *         footerData: mixed,
     *         leftData: mixed,
     *         rightData: mixed
     *     }|null,
     *     dynamicData: array<string, mixed>
     * }
     */
    public function __invoke(Page $page, ?User $viewer = null): array
    {
        $page->loadMissing('siteLayout');
        $siteLayout = $this->resolveSiteLayout($page);
        $pageId = $page->id;
        $layout = null;

        if ($siteLayout instanceof SiteLayout) {
            $layout = [
                'id' => $siteLayout->id,
                'name' => $siteLayout->name,
                'key' => $siteLayout->key,
                'headerData' => $siteLayout->header_data,
                'footerData' => $siteLayout->footer_data,
                'leftData' => $siteLayout->left_data,
                'rightData' => $siteLayout->right_data,
            ];
        }

        return [
            'page' => [
                'id' => $pageId,
                'title' => $page->title,
                'slug' => $page->slug,
                'excerpt' => $page->excerpt,
                'seoTitle' => $page->seo_title,
                'seoDescription' => $page->seo_description,
                'content' => $page->content,
                'contentFormat' => $page->content_format,
                'visibility' => $page->visibility,
            ],
            'layout' => $layout,
            'dynamicData' => ($this->buildPuckDynamicData)($viewer, true),
        ];
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
