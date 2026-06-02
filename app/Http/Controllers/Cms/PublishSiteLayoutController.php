<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\SiteLayout\UpdateSiteLayoutStatusAction;
use App\Http\Controllers\Controller;
use App\Models\SiteLayout;
use Illuminate\Http\RedirectResponse;

final class PublishSiteLayoutController extends Controller
{
    public function __invoke(SiteLayout $siteLayout, UpdateSiteLayoutStatusAction $updateSiteLayoutStatus): RedirectResponse
    {
        $updateSiteLayoutStatus($siteLayout, 'published');

        return back();
    }
}
