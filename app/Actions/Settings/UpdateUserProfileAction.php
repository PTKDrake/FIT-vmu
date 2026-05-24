<?php

declare(strict_types=1);

namespace App\Actions\Settings;

use App\Models\User;

class UpdateUserProfileAction
{
    /**
     * @param  array{name: string, email: string}  $attributes
     */
    public function __invoke(User $user, array $attributes): void
    {
        $user->fill($attributes);

        if ($user->isDirty('email')) {
            $user->forceFill([
                'email_verified_at' => null,
            ]);
        }

        $user->save();
    }
}
