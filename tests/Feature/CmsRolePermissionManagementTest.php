<?php

use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('role policy abilities follow manage roles permission and protect super admin role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $editorRole = Role::findByName('editor', 'web');
    $superAdminRole = Role::findByName('super-admin', 'web');

    expect(Gate::forUser($admin)->allows('viewAny', Role::class))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('create', Role::class))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('update', $editorRole))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('update', $superAdminRole))->toBeFalse()
        ->and(Gate::forUser($superAdmin)->allows('update', $superAdminRole))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('viewAny', Role::class))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('update', $editorRole))->toBeFalse();
});

test('cms roles permissions index renders current role permission matrix', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->get('/cms/roles-permissions')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/roles-permissions/index')
            ->where('can.manageRoles', true)
            ->where('can.managePermissions', true)
            ->where('roles.0.name', 'admin')
            ->where('permissions.0.name', 'create documents')
            ->where('protectedRoleNames.0', 'super-admin')
            ->has('roles')
            ->has('permissions')
        );
});

test('admin can create a custom role and sync permissions via spatie flow', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $response = $this->actingAs($admin)
        ->post('/cms/roles-permissions', [
            'name' => 'content-auditor',
            'permissions' => ['view posts', 'review posts'],
        ]);

    $response->assertRedirect('/cms/roles-permissions');

    $role = Role::findByName('content-auditor', 'web');

    expect($role->permissions()->pluck('name')->sort()->values()->all())
        ->toBe(['review posts', 'view posts']);
});

test('admin can rename a custom role and resync its permissions', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $role = Role::create([
        'name' => 'content-auditor',
        'guard_name' => 'web',
    ]);
    $role->syncPermissions(['view posts']);

    $this->actingAs($admin)
        ->patch("/cms/roles-permissions/{$role->id}", [
            'name' => 'content-reviewer',
            'permissions' => ['view posts', 'review posts'],
        ])
        ->assertRedirect('/cms/roles-permissions');

    $updatedRole = Role::findByName('content-reviewer', 'web');

    expect($updatedRole->permissions()->pluck('name')->sort()->values()->all())
        ->toBe(['review posts', 'view posts'])
        ->and(Role::query()->where('name', 'content-auditor')->exists())->toBeFalse();
});

test('user with manage roles but without manage permissions cannot sync permissions', function () {
    Role::findOrCreate('role-manager', 'web')->syncPermissions(['manage roles']);

    $roleManager = User::factory()->create();
    $roleManager->assignRole('role-manager');

    $role = Role::create([
        'name' => 'basic-reviewer',
        'guard_name' => 'web',
    ]);

    $this->actingAs($roleManager)
        ->patch("/cms/roles-permissions/{$role->id}", [
            'name' => 'basic-reviewer',
            'permissions' => ['view posts'],
        ])
        ->assertSessionHasErrors('permissions');
});

test('admin cannot update the super admin role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $role = Role::findByName('super-admin', 'web');

    $this->actingAs($admin)
        ->patch("/cms/roles-permissions/{$role->id}", [
            'name' => 'super-admin',
            'permissions' => ['view posts'],
        ])
        ->assertForbidden();

    expect($role->fresh()->permissions()->count())->toBeGreaterThan(1);
});

test('staff users cannot access the cms role permission management routes', function () {
    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $role = Role::findByName('editor', 'web');

    $this->actingAs($staff)
        ->get('/cms/roles-permissions')
        ->assertForbidden();

    $this->actingAs($staff)
        ->post('/cms/roles-permissions', [
            'name' => 'blocked-role',
        ])
        ->assertForbidden();

    $this->actingAs($staff)
        ->patch("/cms/roles-permissions/{$role->id}", [
            'name' => 'blocked-role',
        ])
        ->assertForbidden();
});

test('admin can delete a custom role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $role = Role::create([
        'name' => 'temporary-role',
        'guard_name' => 'web',
    ]);

    $this->actingAs($admin)
        ->delete("/cms/roles-permissions/{$role->id}")
        ->assertRedirect('/cms/roles-permissions');

    expect(Role::query()->where('name', 'temporary-role')->exists())->toBeFalse();
});

test('admin cannot delete the super admin role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $role = Role::findByName('super-admin', 'web');

    $this->actingAs($admin)
        ->delete("/cms/roles-permissions/{$role->id}")
        ->assertForbidden();

    expect(Role::query()->where('name', 'super-admin')->exists())->toBeTrue();
});

test('staff users cannot delete roles', function () {
    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $role = Role::findByName('editor', 'web');

    $this->actingAs($staff)
        ->delete("/cms/roles-permissions/{$role->id}")
        ->assertForbidden();

    expect(Role::query()->where('name', 'editor')->exists())->toBeTrue();
});
