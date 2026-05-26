<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\NavigationMenu;
use App\Models\User;

class NavigationMenuPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view navigation');
    }

    public function view(User $user, NavigationMenu $navigationMenu): bool
    {
        return $user->can('view navigation');
    }

    public function create(User $user): bool
    {
        return $user->can('manage navigation');
    }

    public function update(User $user, NavigationMenu $navigationMenu): bool
    {
        return $user->can('manage navigation');
    }

    public function delete(User $user, NavigationMenu $navigationMenu): bool
    {
        return $user->can('manage navigation');
    }

    public function restore(User $user, NavigationMenu $navigationMenu): bool
    {
        return $user->can('manage navigation');
    }

    public function forceDelete(User $user, NavigationMenu $navigationMenu): bool
    {
        return $user->can('manage navigation');
    }
}
