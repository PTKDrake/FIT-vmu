<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Role;

class RolePolicy
{
    /**
     * @var list<string>
     */
    private const PROTECTED_ROLE_NAMES = ['super-admin'];

    public function viewAny(User $user): bool
    {
        return $user->can('manage roles');
    }

    public function view(User $user, Role $role): bool
    {
        return $user->can('manage roles');
    }

    public function create(User $user): bool
    {
        return $user->can('manage roles');
    }

    public function update(User $user, Role $role): bool
    {
        if (! $user->can('manage roles')) {
            return false;
        }

        if (in_array($role->name, self::PROTECTED_ROLE_NAMES, true) && ! $user->hasRole('super-admin')) {
            return false;
        }

        return true;
    }
}
