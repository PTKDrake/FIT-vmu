<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\PostCategory;
use App\Models\User;

class PostCategoryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view post categories');
    }

    public function view(User $user, PostCategory $postCategory): bool
    {
        return $user->can('view post categories');
    }

    public function create(User $user): bool
    {
        return $user->can('manage post categories');
    }

    public function update(User $user, PostCategory $postCategory): bool
    {
        return $user->can('manage post categories');
    }

    public function delete(User $user, PostCategory $postCategory): bool
    {
        return $user->can('manage post categories');
    }

    public function restore(User $user, PostCategory $postCategory): bool
    {
        return $user->can('manage post categories');
    }

    public function forceDelete(User $user, PostCategory $postCategory): bool
    {
        return $user->can('manage post categories');
    }
}
