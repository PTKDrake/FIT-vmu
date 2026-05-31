<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\StaffProfile;
use App\Models\User;

class StaffProfilePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view staff profiles');
    }

    public function view(User $user, StaffProfile $staffProfile): bool
    {
        if ($user->can('view staff profiles')) {
            return true;
        }

        return $staffProfile->user_id === $user->id && $user->can('view own profile');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create staff profiles');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, StaffProfile $staffProfile): bool
    {
        if ($user->can('update staff profiles')) {
            return true;
        }

        return $staffProfile->user_id === $user->id && $user->can('update own profile');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, StaffProfile $staffProfile): bool
    {
        return $user->can('delete staff profiles');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, StaffProfile $staffProfile): bool
    {
        return $user->can('delete staff profiles');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, StaffProfile $staffProfile): bool
    {
        return $user->can('delete staff profiles');
    }
}
