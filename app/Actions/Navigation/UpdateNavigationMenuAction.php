<?php

declare(strict_types=1);

namespace App\Actions\Navigation;

use App\Models\NavigationMenu;
use Illuminate\Support\Facades\DB;

class UpdateNavigationMenuAction
{
    /**
     * @param array{
     *     name: string,
     *     slug: string,
     *     location: string,
     *     is_active: bool
     * } $attributes
     */
    public function __invoke(NavigationMenu $navigationMenu, array $attributes): NavigationMenu
    {
        return DB::transaction(function () use ($navigationMenu, $attributes): NavigationMenu {
            $navigationMenu->update([
                'name' => $attributes['name'],
                'slug' => $attributes['slug'],
                'location' => $attributes['location'],
                'is_active' => $attributes['is_active'],
            ]);

            return $navigationMenu->refresh();
        });
    }
}
