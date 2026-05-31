<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Navigation\BuildNavigationMenusViewDataAction;
use App\Http\Controllers\Controller;
use App\Models\NavigationMenu;
use Inertia\Response;

final class NavigationMenusIndexController extends Controller
{
    public function __invoke(
        BuildNavigationMenusViewDataAction $buildNavigationMenusViewData,
    ): Response {
        $navigationMenus = NavigationMenu::query()
            ->with(['items'])
            ->orderBy('name')
            ->get();

        $viewData = $buildNavigationMenusViewData($navigationMenus);

        return inertia('cms/navigation/index', [
            'navigationMenus' => $viewData['data'],
            'navigationStateVersion' => $viewData['version'],
        ]);
    }
}
