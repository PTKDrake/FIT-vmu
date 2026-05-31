<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Media;
use App\Models\User;

class MediaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view media');
    }

    public function view(User $user, Media $media): bool
    {
        return $user->can('view media');
    }

    public function create(User $user): bool
    {
        return $user->can('upload media');
    }

    public function updateAny(User $user): bool
    {
        return $user->can('update media');
    }

    public function update(User $user, Media $media): bool
    {
        return $user->can('update media');
    }

    public function deleteAny(User $user): bool
    {
        return $user->can('delete media');
    }

    public function delete(User $user, Media $media): bool
    {
        return $user->can('delete media');
    }

    public function restore(User $user, Media $media): bool
    {
        return $user->can('delete media');
    }

    public function forceDelete(User $user, Media $media): bool
    {
        return $user->can('delete media');
    }
}
