<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\SiteLayout\CloneSiteLayoutAction;
use App\Http\Controllers\Controller;
use App\Models\SiteLayout;
use Illuminate\Http\RedirectResponse;

final class CloneSiteLayoutController extends Controller
{
    public function __invoke(SiteLayout $siteLayout, CloneSiteLayoutAction $cloneSiteLayout): RedirectResponse
    {
        $cloneSiteLayout($siteLayout);

        flash('Đã sao chép layout.');

        return to_route('cms.layouts');
    }
}
