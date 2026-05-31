<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Navigation\SyncNavigationMenuItemsAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\SyncNavigationMenuItemsRequest;
use App\Models\NavigationMenu;
use Illuminate\Http\RedirectResponse;

final class SyncNavigationMenuItemsController extends Controller
{
    public function __invoke(
        SyncNavigationMenuItemsRequest $request,
        NavigationMenu $navigationMenu,
        SyncNavigationMenuItemsAction $syncNavigationMenuItems,
    ): RedirectResponse {
        /** @var array{
         *     items: array<int, array{
         *         id: int,
         *         parent_id: int|null,
         *         title: string,
         *         type: 'custom_url'|'post_category'|'page'|'post',
         *         linkable_type: 'post_category'|'page'|'post'|null,
         *         linkable_id: int|null,
         *         url: string|null,
         *         target: '_self'|'_blank',
         *         sort_order: int,
         *         is_active: bool
         *     }>
         * } $validated
         */
        $validated = $request->validated();

        $syncNavigationMenuItems($navigationMenu, array_values($validated['items']));

        flash('Đã cập nhật navigation menu.');

        return back();
    }
}
