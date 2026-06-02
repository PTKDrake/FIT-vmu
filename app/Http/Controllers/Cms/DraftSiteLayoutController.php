<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\SiteLayout\UpdateSiteLayoutStatusAction;
use App\Http\Controllers\Controller;
use App\Models\SiteLayout;
use Illuminate\Http\RedirectResponse;

final class DraftSiteLayoutController extends Controller
{
    public function __invoke(SiteLayout $siteLayout, UpdateSiteLayoutStatusAction $updateSiteLayoutStatus): RedirectResponse
    {
        try {
            $updateSiteLayoutStatus($siteLayout, 'draft');
        } catch (\DomainException $exception) {
            return back()->withErrors(['layout' => $exception->getMessage()]);
        }

        return back();
    }
}
