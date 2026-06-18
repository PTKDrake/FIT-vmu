<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\PublicSite\BuildPublicPagePropsAction;
use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, BuildPublicPagePropsAction $buildPublicPageProps): Response|RedirectResponse
    {
        $homepageId = SiteSetting::homepagePageId();
        $homepage = $homepageId !== null ? Page::query()->find($homepageId) : null;

        /** @var User|null $viewer */
        $viewer = $request->user();

        if ($homepage !== null) {
            if (! $homepage->isVisibleTo($viewer)) {
                if (! $viewer instanceof User && $homepage->requiresAuthenticationForViewing()) {
                    return to_route('login');
                }

                abort(403);
            }

            return inertia('public/page', $buildPublicPageProps($homepage, $viewer));
        }

        return inertia('home/page');
    }
}
