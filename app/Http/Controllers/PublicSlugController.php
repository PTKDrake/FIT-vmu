<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\PublicSite\BuildPublicPagePropsAction;
use App\Actions\PublicSite\BuildPublicPostCategoryPropsAction;
use App\Models\Page;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

final class PublicSlugController extends Controller
{
    public function __invoke(
        Request $request,
        string $slug,
        BuildPublicPostCategoryPropsAction $buildCategoryProps,
        BuildPublicPagePropsAction $buildPageProps,
    ): Response|RedirectResponse {
        /** @var User|null $viewer */
        $viewer = $request->user();

        $category = PostCategory::query()->where('slug', $slug)->first();

        if ($category instanceof PostCategory && $category->is_active === true) {
            return inertia('public/post-category', $buildCategoryProps($category, $viewer));
        }

        $page = Page::query()->where('slug', $slug)->first();

        if ($page instanceof Page) {
            if (! $page->isVisibleTo($viewer)) {
                if (! $viewer instanceof User && $page->requiresAuthenticationForViewing()) {
                    return to_route('login');
                }

                abort(403);
            }

            return inertia('public/page', $buildPageProps($page, $viewer));
        }

        abort(404);
    }
}
