<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\SiteLayout\DeleteSiteLayoutAction;
use App\Http\Controllers\Controller;
use App\Models\SiteLayout;
use Illuminate\Http\RedirectResponse;

final class DeleteSiteLayoutController extends Controller
{
    public function __invoke(SiteLayout $siteLayout, DeleteSiteLayoutAction $deleteSiteLayout): RedirectResponse
    {
        try {
            $deleteSiteLayout($siteLayout);
        } catch (\DomainException $exception) {
            return back()->withErrors(['layout' => $exception->getMessage()]);
        }

        return to_route('cms.layouts');
    }
}
