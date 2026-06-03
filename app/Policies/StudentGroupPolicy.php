<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\StudentGroup;
use App\Models\User;

class StudentGroupPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('manage student groups') || $user->can('manage shared student groups');
    }

    public function view(User $user, StudentGroup $studentGroup): bool
    {
        return $this->update($user, $studentGroup);
    }

    public function create(User $user): bool
    {
        return $user->can('manage student groups') || $user->can('manage shared student groups');
    }

    public function createGlobal(User $user): bool
    {
        return $user->can('manage shared student groups');
    }

    public function update(User $user, StudentGroup $studentGroup): bool
    {
        if ($studentGroup->isGlobal()) {
            return $user->can('manage shared student groups');
        }

        return $user->can('manage student groups') && $studentGroup->isOwnedBy($user);
    }

    public function delete(User $user, StudentGroup $studentGroup): bool
    {
        return $this->update($user, $studentGroup);
    }
}
