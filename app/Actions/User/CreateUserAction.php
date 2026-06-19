<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\Events\CmsContentChanged;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;

class CreateUserAction
{
    /**
     * @param  array{
     *     name: string,
     *     email: string,
     *     password: string,
     *     email_verified: bool,
     *     roles?: list<string>
     * }  $attributes
     */
    public function __invoke(User $actor, array $attributes): User
    {
        $roles = $attributes['roles'] ?? [];

        $this->ensureActorCanAssignRoles($actor, $roles);

        return DB::transaction(function () use ($attributes, $roles): User {
            $user = User::query()->create([
                'name' => $attributes['name'],
                'email' => $attributes['email'],
                'password' => $attributes['password'],
                'email_verified_at' => $attributes['email_verified'] ? now() : null,
            ]);

            if ($roles !== []) {
                $user->syncRoles($roles);
            }

            event(CmsContentChanged::forResource(
                resource: 'users',
                recordId: $user->getKey(),
                title: $user->name,
                status: $user->email_verified_at !== null ? 'verified' : 'unverified',
                action: 'created',
                message: 'Đã tạo người dùng.',
                updatedAt: $user->updated_at,
            ));

            return $user->refresh();
        });
    }

    /**
     * @param  list<string>  $roles
     */
    private function ensureActorCanAssignRoles(User $actor, array $roles): void
    {
        if (in_array('super-admin', $roles, true) && ! $actor->hasRole('super-admin')) {
            throw new AuthorizationException('You are not authorized to assign the super-admin role.');
        }
    }
}
