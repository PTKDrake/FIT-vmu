<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\SiteLayout\CreateSiteLayoutAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSiteLayoutRequest;
use Illuminate\Http\RedirectResponse;

final class StoreSiteLayoutController extends Controller
{
    public function __invoke(StoreSiteLayoutRequest $request, CreateSiteLayoutAction $createSiteLayout): RedirectResponse
    {
        $validated = $request->validated();
        /** @var array{
         *     name: string,
         *     key: string,
         *     header_data?: ?string,
         *     footer_data?: ?string,
         *     left_data?: ?string,
         *     right_data?: ?string,
         *     status: string,
         *     is_default?: bool
         * } $validated
         */
        $siteLayout = $createSiteLayout($validated);

        return to_route('cms.layouts.edit', $siteLayout);
    }
}
