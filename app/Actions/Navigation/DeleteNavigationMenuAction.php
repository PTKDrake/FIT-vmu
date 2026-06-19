<?php

declare(strict_types=1);

namespace App\Actions\Navigation;

use App\Events\CmsContentChanged;
use App\Models\NavigationMenu;
use Illuminate\Support\Facades\DB;

class DeleteNavigationMenuAction
{
    public function __invoke(NavigationMenu $navigationMenu): void
    {
        DB::transaction(function () use ($navigationMenu): void {
            $navigationMenu->delete();

            event(CmsContentChanged::forResource(
                resource: 'navigation',
                recordId: $navigationMenu->getKey(),
                title: $navigationMenu->name,
                status: $navigationMenu->is_active ? 'active' : 'inactive',
                action: 'deleted',
                message: 'Đã xóa menu điều hướng.',
                updatedAt: $navigationMenu->updated_at,
            ));
        });
    }
}
