<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Position;
use App\Models\User;

class PositionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view units');
    }

    public function view(User $user, Position $position): bool
    {
        return $user->can('view units');
    }

    public function create(User $user): bool
    {
        return $user->can('manage positions');
    }

    public function update(User $user, Position $position): bool
    {
        return $user->can('manage positions');
    }

    public function delete(User $user, Position $position): bool
    {
        return $user->can('manage positions');
    }

    public function restore(User $user, Position $position): bool
    {
        return $user->can('manage positions');
    }

    public function forceDelete(User $user, Position $position): bool
    {
        return $user->can('manage positions');
    }
}
