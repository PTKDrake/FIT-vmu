<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;

class UpdateUserAction
{
    /**
     * @param  array{
     *     name: string,
     *     email: string,
     *     password?: string|null,
     *     email_verified: bool,
     *     roles?: list<string>
     * }  $attributes
     */
    public function __invoke(User $actor, User $user, array $attributes): User
    {
        $roles = $attributes['roles'] ?? null;

        if (is_array($roles)) {
            $this->ensureActorCanAssignRoles($actor, $user, $roles);
        }

        return DB::transaction(function () use ($user, $attributes, $roles): User {
            $payload = [
                'name' => $attributes['name'],
                'email' => $attributes['email'],
                'email_verified_at' => $attributes['email_verified']
                    ? ($user->email_verified_at ?? now())
                    : null,
            ];

            if (filled($attributes['password'] ?? null)) {
                $payload['password'] = $attributes['password'];
            }

            $user->update($payload);

            if (is_array($roles)) {
                $user->syncRoles($roles);
            }

            return $user->refresh();
        });
    }

    /**
     * @param  list<string>  $roles
     */
    private function ensureActorCanAssignRoles(User $actor, User $target, array $roles): void
    {
        $currentRoles = $target->getRoleNames()->values()->all();

        if (in_array('super-admin', $currentRoles, true) && ! $actor->hasRole('super-admin')) {
            throw new AuthorizationException('You are not authorized to manage a super-admin account.');
        }

        if (in_array('super-admin', $roles, true) && ! $actor->hasRole('super-admin')) {
            throw new AuthorizationException('You are not authorized to assign the super-admin role.');
        }

        if ($actor->is($target)) {
            $newRoles = array_diff($roles, $currentRoles);

            if ($newRoles !== []) {
                throw new AuthorizationException('You are not authorized to elevate your own roles.');
            }
        }
    }
}
