<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

final class RolesPermissionsIndexController extends Controller
{
    /**
     * @var list<string>
     */
    private const PROTECTED_ROLE_NAMES = ['super-admin'];

    public function __invoke(Request $request): Response
    {
        $roles = Role::query()
            ->with('permissions:id,name')
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role): array => [
                'id' => $role->id,
                'name' => $role->name,
                'guardName' => $role->guard_name,
                'isProtected' => in_array($role->name, self::PROTECTED_ROLE_NAMES, true),
                'permissions' => $role->permissions
                    ->pluck('name')
                    ->sort()
                    ->values()
                    ->all(),
                'permissionCount' => $role->permissions->count(),
            ])
            ->values()
            ->all();

        $permissions = Permission::query()
            ->with('roles:id,name')
            ->orderBy('name')
            ->get()
            ->map(fn (Permission $permission): array => [
                'id' => $permission->id,
                'name' => $permission->name,
                'guardName' => $permission->guard_name,
                'roles' => $permission->roles
                    ->pluck('name')
                    ->sort()
                    ->values()
                    ->all(),
                'roleCount' => $permission->roles->count(),
            ])
            ->values()
            ->all();

        return inertia('cms/roles-permissions/index', [
            'can' => [
                'manageRoles' => $request->user()?->can('manage roles') ?? false,
                'managePermissions' => $request->user()?->can('manage permissions') ?? false,
                'createRoles' => $request->user()?->can('create', Role::class) ?? false,
            ],
            'roles' => $roles,
            'permissions' => $permissions,
            'protectedRoleNames' => self::PROTECTED_ROLE_NAMES,
        ]);
    }
}
