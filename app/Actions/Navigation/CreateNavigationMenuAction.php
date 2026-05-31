<?php

declare(strict_types=1);

namespace App\Actions\Navigation;

use App\Models\NavigationMenu;
use Illuminate\Support\Facades\DB;

class CreateNavigationMenuAction
{
    /**
     * @param array{
     *     name: string,
     *     slug: string,
     *     location: string,
     *     is_active: bool
     * } $attributes
     */
    public function __invoke(array $attributes): NavigationMenu
    {
        return DB::transaction(function () use ($attributes): NavigationMenu {
            return NavigationMenu::query()->create([
                'name' => $attributes['name'],
                'slug' => $attributes['slug'],
                'location' => $attributes['location'],
                'is_active' => $attributes['is_active'],
            ]);
        });
    }
}
