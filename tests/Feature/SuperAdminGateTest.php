<?php

use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;

test('super admin bypasses all ability checks via gate before', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');

    expect(Gate::forUser($superAdmin)->allows('manage users'))->toBeTrue()
        ->and(Gate::forUser($superAdmin)->allows('an ability that does not exist'))->toBeTrue();
});

test('non super admin users still rely on their normal permission checks', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    expect(Gate::forUser($admin)->allows('manage users'))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('manage users'))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('view own profile'))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('publish posts'))->toBeFalse();
});

test('inertia auth share exposes role permissions for cms access', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin);

    $this->get('/cms')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/dashboard')
            ->where('auth.permissions', $admin->getAllPermissions()->pluck('name')->sort()->values()->all())
        );
});
