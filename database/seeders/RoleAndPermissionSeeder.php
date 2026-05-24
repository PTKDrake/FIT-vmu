<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * @var list<string>
     */
    private const PERMISSIONS = [
        'manage users',
        'manage roles',
        'manage permissions',
        'view admin dashboard',
        'view posts',
        'create posts',
        'update posts',
        'delete posts',
        'publish posts',
        'review posts',
        'view documents',
        'create documents',
        'update documents',
        'delete documents',
        'publish documents',
        'review documents',
        'download restricted documents',
        'view student scoped documents',
        'view staff profiles',
        'create staff profiles',
        'update staff profiles',
        'delete staff profiles',
        'publish staff profiles',
        'view units',
        'manage units',
        'manage positions',
        'manage staff appointments',
        'view own profile',
        'update own profile',
        'view own documents',
        'create own documents',
        'update own documents',
        'delete own documents',
        'view student profile',
        'view own personalized documents',
    ];

    /**
     * @var array<string, list<string>>
     */
    private const ROLE_PERMISSIONS = [
        'super-admin' => self::PERMISSIONS,
        'admin' => [
            'manage users',
            'manage roles',
            'manage permissions',
            'view admin dashboard',
            'view posts',
            'create posts',
            'update posts',
            'delete posts',
            'publish posts',
            'review posts',
            'view documents',
            'create documents',
            'update documents',
            'delete documents',
            'publish documents',
            'review documents',
            'download restricted documents',
            'view student scoped documents',
            'view staff profiles',
            'create staff profiles',
            'update staff profiles',
            'delete staff profiles',
            'publish staff profiles',
            'view units',
            'manage units',
            'manage positions',
            'manage staff appointments',
            'view own profile',
            'update own profile',
            'view own documents',
            'create own documents',
            'update own documents',
            'delete own documents',
            'view student profile',
            'view own personalized documents',
        ],
        'editor' => [
            'view admin dashboard',
            'view posts',
            'create posts',
            'update posts',
            'delete posts',
            'publish posts',
            'review posts',
            'view documents',
            'create documents',
            'update documents',
            'delete documents',
            'publish documents',
            'review documents',
            'download restricted documents',
            'view staff profiles',
            'create staff profiles',
            'update staff profiles',
            'delete staff profiles',
            'publish staff profiles',
            'view units',
            'view own profile',
            'update own profile',
            'view own documents',
            'create own documents',
            'update own documents',
            'delete own documents',
        ],
        'staff' => [
            'view admin dashboard',
            'view documents',
            'download restricted documents',
            'view staff profiles',
            'view units',
            'view own profile',
            'update own profile',
            'view own documents',
            'create own documents',
            'update own documents',
            'delete own documents',
        ],
        'student' => [
            'view documents',
            'view student scoped documents',
            'view student profile',
            'view own personalized documents',
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (self::PERMISSIONS as $permissionName) {
            Permission::findOrCreate($permissionName, 'web');
        }

        foreach (self::ROLE_PERMISSIONS as $roleName => $permissions) {
            $role = Role::findOrCreate($roleName, 'web');
            $role->syncPermissions($permissions);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
