<?php

declare(strict_types=1);

namespace App\Actions\PublicSite;

use App\Actions\Puck\BuildPuckDynamicDataAction;
use App\Models\Page;
use App\Models\SiteLayout;
use App\Models\SiteSetting;
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
            'dynamicData' => ($this->buildPuckDynamicData)(
                $viewer,
                true,
                $this->puckPayloads($page->content, $layout),
            ),
        ];
    }

    /**
     * @param  array<string, mixed>|null  $layout
     * @return list<mixed>
     */
    private function puckPayloads(?string $content, ?array $layout): array
    {
        return array_values(array_filter([
            $content,
            $layout['headerData'] ?? null,
            $layout['footerData'] ?? null,
            $layout['leftData'] ?? null,
            $layout['rightData'] ?? null,
        ]));
    }

    private function resolveSiteLayout(Page $page): ?SiteLayout
    {
        if ($page->siteLayout instanceof SiteLayout) {
            return $page->siteLayout;
        }

        $defaultId = SiteSetting::defaultPageLayoutId();

        if ($defaultId === null) {
            return null;
        }

        $default = SiteLayout::query()
            ->where('id', $defaultId)
            ->first();

        return $default;
    }
}
