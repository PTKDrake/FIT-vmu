<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Puck\BuildPuckDynamicDataAction;
use App\Http\Controllers\Controller;
use App\Models\Page;
use Inertia\Response;

final class PageShowController extends Controller
{
    public function __invoke(Page $page, BuildPuckDynamicDataAction $buildPuckDynamicData): Response
    {
        return inertia('cms/pages/show', [
            'page' => [
                'id' => $page->getKey(),
                'title' => $page->title,
                'slug' => $page->slug,
                'content' => $page->content,
                'contentFormat' => $page->content_format,
                'seoTitle' => $page->seo_title,
                'seoDescription' => $page->seo_description,
                'excerpt' => $page->excerpt,
            ],
            'dynamicData' => $buildPuckDynamicData(),
        ]);
    }
}
