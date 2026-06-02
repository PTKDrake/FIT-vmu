<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\SiteLayout;
use App\Models\User;

class SiteLayoutPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view pages');
    }

    public function view(User $user, SiteLayout $siteLayout): bool
    {
        return $user->can('view pages');
    }

    public function create(User $user): bool
    {
        return $user->can('create pages');
    }

    public function update(User $user, SiteLayout $siteLayout): bool
    {
        return $user->can('update pages');
    }

    public function delete(User $user, SiteLayout $siteLayout): bool
    {
        return $user->can('delete pages');
    }
}
