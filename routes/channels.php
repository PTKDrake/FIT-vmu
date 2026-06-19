<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function (User $user, int $id): bool {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('cms-user.{userId}', function (User $user, int $userId): bool {
    return (int) $user->id === $userId
        && $user->can('view admin dashboard');
});

Broadcast::channel('cms.{resource}', function (User $user, string $resource): bool {
    return $user->can('view admin dashboard');
});
