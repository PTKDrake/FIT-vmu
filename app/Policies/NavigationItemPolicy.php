<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\NavigationItem;
use App\Models\User;

class NavigationItemPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view navigation');
    }

    public function view(User $user, NavigationItem $navigationItem): bool
    {
        return $user->can('view navigation');
    }

    public function create(User $user): bool
    {
        return $user->can('manage navigation');
    }

    public function update(User $user, NavigationItem $navigationItem): bool
    {
        return $user->can('manage navigation');
    }

    public function delete(User $user, NavigationItem $navigationItem): bool
    {
        return $user->can('manage navigation');
    }

    public function restore(User $user, NavigationItem $navigationItem): bool
    {
        return $user->can('manage navigation');
    }

    public function forceDelete(User $user, NavigationItem $navigationItem): bool
    {
        return $user->can('manage navigation');
    }
}
