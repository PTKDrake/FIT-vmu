<?php

declare(strict_types=1);

namespace App\Actions\Navigation;

use App\Events\CmsContentChanged;
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

            event(CmsContentChanged::forResource(
                resource: 'navigation',
                recordId: $navigationMenu->getKey(),
                title: $navigationMenu->name,
                status: $navigationMenu->is_active ? 'active' : 'inactive',
                action: 'updated',
                message: 'Đã cập nhật menu điều hướng.',
                updatedAt: $navigationMenu->updated_at,
            ));

            return $navigationMenu->refresh();
        });
    }
}
