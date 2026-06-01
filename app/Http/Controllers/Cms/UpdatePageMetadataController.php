<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Page\UpdatePageMetadataAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePageMetadataRequest;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;

final class UpdatePageMetadataController extends Controller
{
    public function __invoke(
        UpdatePageMetadataRequest $request,
        Page $page,
        UpdatePageMetadataAction $updatePageMetadata,
    ): RedirectResponse {
        $validated = $request->validated();
        /** @var array{
         *     title: string,
         *     slug: string,
         *     excerpt?: ?string,
         *     seo_title?: ?string,
         *     seo_description?: ?string,
         *     template_key?: ?string,
         *     template_data?: ?array<string, mixed>
         * } $validated
         */
        $updatePageMetadata($page, $validated);

        return back();
    }
}
