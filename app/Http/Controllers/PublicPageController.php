<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\PublicSite\BuildPublicPageDataAction;
use App\Actions\PublicSite\BuildPublicShellDataAction;
use App\Models\Page;
use Inertia\Response;

final class PublicPageController extends Controller
{
    public function __invoke(
        Page $page,
        BuildPublicPageDataAction $buildPublicPageData,
        BuildPublicShellDataAction $buildPublicShellData,
    ): Response {
        abort_unless($page->status === 'published', 404);

        return inertia('public/show', [
            'type' => 'page',
            'data' => $buildPublicPageData($page),
            ...$buildPublicShellData(),
        ]);
    }
}
