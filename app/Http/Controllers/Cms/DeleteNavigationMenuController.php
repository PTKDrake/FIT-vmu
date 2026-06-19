<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Navigation\DeleteNavigationMenuAction;
use App\Http\Controllers\Controller;
use App\Models\NavigationMenu;
use Illuminate\Http\RedirectResponse;

final class DeleteNavigationMenuController extends Controller
{
    public function __invoke(NavigationMenu $navigationMenu, DeleteNavigationMenuAction $deleteNavigationMenu): RedirectResponse
    {
        $deleteNavigationMenu($navigationMenu);

        flash('Đã xóa menu điều hướng.');

        return to_route('cms.navigation');
    }
}
