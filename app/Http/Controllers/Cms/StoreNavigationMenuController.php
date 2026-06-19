<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Navigation\CreateNavigationMenuAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNavigationMenuRequest;
use Illuminate\Http\RedirectResponse;

final class StoreNavigationMenuController extends Controller
{
    public function __invoke(StoreNavigationMenuRequest $request, CreateNavigationMenuAction $createNavigationMenu): RedirectResponse
    {
        /** @var array{
         *     name: string,
         *     slug: string,
         *     location: string,
         *     is_active: bool
         * } $validated
         */
        $validated = $request->validated();

        $createNavigationMenu($validated);

        flash('Đã tạo menu điều hướng mới.');

        return to_route('cms.navigation');
    }
}
