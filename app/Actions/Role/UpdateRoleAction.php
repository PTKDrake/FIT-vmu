<?php

declare(strict_types=1);

namespace App\Actions\Role;

use App\Events\CmsContentChanged;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class UpdateRoleAction
{
    /**
     * @param  array{
     *     name: string,
     *     permissions?: list<string>
     * }  $attributes
     */
    public function __invoke(User $actor, Role $role, array $attributes): Role
    {
        $permissions = $attributes['permissions'] ?? null;

        if (is_array($permissions)) {
            $this->ensureActorCanManagePermissions($actor, $role, $permissions);
        }

        /** @var Role $updatedRole */
        $updatedRole = DB::transaction(function () use ($role, $attributes, $permissions): Role {
            $role->update([
                'name' => $attributes['name'],
            ]);

            if (is_array($permissions)) {
                $role->syncPermissions($permissions);
            }

            return $role->load('permissions');
        });

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        event(CmsContentChanged::forResource(
            resource: 'roles',
            recordId: $updatedRole->getKey(),
            title: $updatedRole->name,
            status: $updatedRole->guard_name,
            action: 'updated',
            message: 'Đã cập nhật vai trò.',
            updatedAt: $updatedRole->updated_at,
        ));

        return $updatedRole;
    }

    /**
     * @param  list<string>  $permissions
     */
    private function ensureActorCanManagePermissions(User $actor, Role $role, array $permissions): void
    {
        if (! $actor->can('manage permissions')) {
            throw new AuthorizationException('You are not authorized to manage role permissions.');
        }

        if ($role->name === 'super-admin' && ! $actor->hasRole('super-admin')) {
            throw new AuthorizationException('You are not authorized to manage the super-admin role.');
        }

        if (in_array('manage roles', $permissions, true) && ! $actor->hasRole('super-admin') && $role->name === 'super-admin') {
            throw new AuthorizationException('You are not authorized to manage the super-admin role.');
        }
    }
}
