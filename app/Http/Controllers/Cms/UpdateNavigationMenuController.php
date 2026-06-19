<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Navigation\UpdateNavigationMenuAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateNavigationMenuRequest;
use App\Models\NavigationMenu;
use Illuminate\Http\RedirectResponse;

final class UpdateNavigationMenuController extends Controller
{
    public function __invoke(UpdateNavigationMenuRequest $request, NavigationMenu $navigationMenu, UpdateNavigationMenuAction $updateNavigationMenu): RedirectResponse
    {
        /** @var array{
         *     name: string,
         *     slug: string,
         *     location: string,
         *     is_active: bool
         * } $validated
         */
        $validated = $request->validated();

        $updateNavigationMenu($navigationMenu, $validated);

        flash('Đã cập nhật menu điều hướng.');

        return back();
    }
}
