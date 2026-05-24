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

    expect(Permission::query()->count())->toBe(35);

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
        'publish documents',
        'manage staff appointments',
    )->not->toContain('non-existent permission');

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
