<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\PublicSite\BuildPublicPagePropsAction;
use App\Models\Page;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

final class PublicPageController extends Controller
{
    public function __invoke(
        Request $request,
        Page $page,
        BuildPublicPagePropsAction $buildPublicPageProps,
    ): Response|RedirectResponse {
        abort_unless($page->status === 'published', 404);

        /** @var User|null $viewer */
        $viewer = $request->user();

        if (! $page->isVisibleTo($viewer)) {
            if (! $viewer instanceof User && $page->requiresAuthenticationForViewing()) {
                return to_route('login');
            }

            abort(403);
        }

        return inertia('public/page', $buildPublicPageProps($page, $viewer));
    }
}
