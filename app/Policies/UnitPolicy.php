<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Unit;
use App\Models\User;

class UnitPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view units');
    }

    public function view(User $user, Unit $unit): bool
    {
        return $user->can('view units');
    }

    public function create(User $user): bool
    {
        return $user->can('manage units');
    }

    public function update(User $user, Unit $unit): bool
    {
        return $user->can('manage units');
    }

    public function delete(User $user, Unit $unit): bool
    {
        return $user->can('manage units');
    }

    public function restore(User $user, Unit $unit): bool
    {
        return $user->can('manage units');
    }

    public function forceDelete(User $user, Unit $unit): bool
    {
        return $user->can('manage units');
    }
}
