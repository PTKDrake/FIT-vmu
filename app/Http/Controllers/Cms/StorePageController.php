<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Page\CreatePageAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePageRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

final class StorePageController extends Controller
{
    public function __invoke(StorePageRequest $request, CreatePageAction $createPage): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        abort_unless($user instanceof User, 403);
        /** @var array{
         *     title: string,
         *     slug: string,
         *     excerpt?: ?string,
         *     seo_title?: ?string,
         *     seo_description?: ?string,
         *     content: string,
         *     content_format: string,
         *     thumbnail_id?: ?int,
         *     status: string
         * } $validated
         */
        $page = $createPage(
            $user,
            $validated,
        );

        return to_route('cms.pages.edit', $page);
    }
}
