<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Navigation\SyncNavigationMenuTreeAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\SyncNavigationMenuTreeRequest;
use App\Models\NavigationMenu;
use Illuminate\Http\RedirectResponse;

class SyncNavigationMenuTreeController extends Controller
{
    public function __invoke(
        SyncNavigationMenuTreeRequest $request,
        NavigationMenu $navigation_menu,
        SyncNavigationMenuTreeAction $syncNavigationMenuTree,
    ): RedirectResponse {
        $syncNavigationMenuTree(
            $navigation_menu,
            $request->validatedItems(),
        );

        return redirect()->route('cms.navigation')
            ->with('success', 'Đã lưu thay đổi navigation.');
    }
}
