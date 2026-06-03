<?php

use Database\Seeders\RoleAndPermissionSeeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

test('role and permission seeder is idempotent and syncs the mvp matrix', function () {
    $this->seed(RoleAndPermissionSeeder::class);
    $this->seed(RoleAndPermissionSeeder::class);

    expect(Role::query()->pluck('name')->sort()->values()->all())->toBe([
        'admin',
        'editor',
        'staff',
        'student',
        'super-admin',
    ]);

    expect(Permission::query()->count())->toBe(50);

    $adminPermissions = Role::findByName('admin', 'web')
        ->permissions
        ->pluck('name')
        ->sort()
        ->values()
        ->all();

    expect($adminPermissions)->toContain(
        'manage users',
        'manage roles',
        'manage permissions',
        'publish posts',
        'publish pages',
        'publish documents',
        'manage post categories',
        'manage navigation',
        'manage student groups',
        'manage shared student groups',
        'manage staff appointments',
        'update media',
        'delete media',
    )->not->toContain('non-existent permission');

    $editorPermissions = Role::findByName('editor', 'web')
        ->permissions
        ->pluck('name')
        ->sort()
        ->values()
        ->all();

    expect($editorPermissions)->toContain(
        'manage post categories',
        'publish pages',
        'manage navigation',
        'manage student groups',
        'manage shared student groups',
        'upload media',
        'update media',
    );

    $studentPermissions = Role::findByName('student', 'web')
        ->permissions
        ->pluck('name')
        ->sort()
        ->values()
        ->all();

    expect($studentPermissions)->toBe([
        'view documents',
        'view own personalized documents',
        'view student profile',
        'view student scoped documents',
    ]);

    expect(Role::findByName('super-admin', 'web')->permissions()->count())
        ->toBe(Permission::query()->count());
});
