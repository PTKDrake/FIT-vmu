<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Page\UpdatePageContentAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePageContentRequest;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;

final class UpdatePageContentController extends Controller
{
    public function __invoke(
        UpdatePageContentRequest $request,
        Page $page,
        UpdatePageContentAction $updatePageContent,
    ): RedirectResponse {
        $validated = $request->validated();
        /** @var array{
         *     content: string,
         *     content_format: string
         * } $validated
         */
        $updatePageContent($page, $validated);

        return back();
    }
}
