<?php

declare(strict_types=1);

namespace App\Actions\Settings;

use App\Models\User;

class DeleteUserAccountAction
{
    public function __invoke(User $user): void
    {
        $user->delete();
    }
}
