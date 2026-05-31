<?php

declare(strict_types=1);

namespace App\Actions\Role;

use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class CreateRoleAction
{
    /**
     * @param  array{
     *     name: string,
     *     permissions?: list<string>
     * }  $attributes
     */
    public function __invoke(User $actor, array $attributes): Role
    {
        $permissions = $attributes['permissions'] ?? [];

        $this->ensureActorCanManagePermissions($actor, $permissions);

        /** @var Role $role */
        $role = DB::transaction(function () use ($attributes, $permissions): Role {
            $role = Role::query()->create([
                'name' => $attributes['name'],
                'guard_name' => 'web',
            ]);

            if ($permissions !== []) {
                $role->syncPermissions($permissions);
            }

            return $role->load('permissions');
        });

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $role;
    }

    /**
     * @param  list<string>  $permissions
     */
    private function ensureActorCanManagePermissions(User $actor, array $permissions): void
    {
        if ($permissions !== [] && ! $actor->can('manage permissions')) {
            throw new AuthorizationException('You are not authorized to manage role permissions.');
        }
    }
}
