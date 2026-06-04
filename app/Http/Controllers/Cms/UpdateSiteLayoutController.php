<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\SiteLayout\UpdateSiteLayoutAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSiteLayoutRequest;
use App\Models\SiteLayout;
use Illuminate\Http\RedirectResponse;

final class UpdateSiteLayoutController extends Controller
{
    public function __invoke(
        UpdateSiteLayoutRequest $request,
        SiteLayout $siteLayout,
        UpdateSiteLayoutAction $updateSiteLayout,
    ): RedirectResponse {
        $validated = $request->validated();
        /** @var array{
         *     name: string,
         *     key: string,
         *     header_data?: ?string,
         *     footer_data?: ?string,
         *     left_data?: ?string,
         *     right_data?: ?string,
         *     status: string
         * } $validated
         */
        $updateSiteLayout($siteLayout, $validated);

        return back();
    }
}
