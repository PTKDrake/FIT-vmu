<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\SiteLayout\SetDefaultSiteLayoutAction;
use App\Http\Controllers\Controller;
use App\Models\SiteLayout;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

final class SetDefaultSiteLayoutController extends Controller
{
    public function __invoke(Request $request, SiteLayout $siteLayout, SetDefaultSiteLayoutAction $setDefaultSiteLayout): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'string', Rule::in(['page', 'category', 'post'])],
        ]);

        /** @var array{type: string} $validated */
        $setDefaultSiteLayout($siteLayout, $validated['type']);

        return back();
    }
}
