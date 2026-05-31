<?php

declare(strict_types=1);

namespace App\Actions\Navigation;

use App\Models\NavigationMenu;
use Illuminate\Support\Facades\DB;

class DeleteNavigationMenuAction
{
    public function __invoke(NavigationMenu $navigationMenu): void
    {
        DB::transaction(function () use ($navigationMenu): void {
            $navigationMenu->delete();
        });
    }
}
