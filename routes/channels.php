<?php

use App\Models\Page;
use App\Models\Post;
use App\Models\StaffProfile;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function (User $user, int $id): bool {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('cms-user.{userId}', function (User $user, int $userId): bool {
    return (int) $user->id === $userId
        && $user->can('view admin dashboard');
});

Broadcast::channel('cms.posts', function (User $user): bool {
    return $user->can('viewAny', Post::class);
});

Broadcast::channel('cms.pages', function (User $user): bool {
    return $user->can('viewAny', Page::class);
});

Broadcast::channel('cms.units', function (User $user): bool {
    return $user->can('viewAny', Unit::class);
});

Broadcast::channel('cms.staff-profiles', function (User $user): bool {
    return $user->can('viewAny', StaffProfile::class);
});
