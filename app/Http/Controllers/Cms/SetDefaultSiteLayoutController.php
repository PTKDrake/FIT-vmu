<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\SiteLayout\SetDefaultSiteLayoutAction;
use App\Http\Controllers\Controller;
use App\Models\SiteLayout;
use Illuminate\Http\RedirectResponse;

final class SetDefaultSiteLayoutController extends Controller
{
    public function __invoke(SiteLayout $siteLayout, SetDefaultSiteLayoutAction $setDefaultSiteLayout): RedirectResponse
    {
        $setDefaultSiteLayout($siteLayout);

        return back();
    }
}
