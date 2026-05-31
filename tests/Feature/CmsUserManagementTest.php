<?php

use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('user policy abilities follow manage users permission', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $target = User::factory()->create();

    expect(Gate::forUser($admin)->allows('viewAny', User::class))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('create', User::class))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('update', $target))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('viewAny', User::class))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('update', $target))->toBeFalse();
});

test('cms users index renders filtered list with roles and verification status', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $verifiedEditor = User::factory()->create([
        'name' => 'Nguyen Editor',
        'email' => 'editor@example.com',
        'email_verified_at' => now(),
    ]);
    $verifiedEditor->assignRole('editor');

    $unverifiedStaff = User::factory()->unverified()->create([
        'name' => 'Tran Staff',
        'email' => 'staff@example.com',
    ]);
    $unverifiedStaff->assignRole('staff');

    $this->actingAs($admin)
        ->get('/cms/users?search=editor&status=verified&role=editor')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/users/index')
            ->where('can.manageUsers', true)
            ->where('can.manageRoles', true)
            ->where('filters.search', 'editor')
            ->where('filters.status', 'verified')
            ->where('filters.role', 'editor')
            ->where('users.data.0.id', $verifiedEditor->id)
            ->where('users.data.0.email', 'editor@example.com')
            ->where('users.data.0.roles.0', 'editor')
            ->where('users.data.0.status', 'verified')
            ->has('users.data', 1)
            ->has('roleOptions')
        );
});

test('admin can create a user and assign roles via spatie flow', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $response = $this->actingAs($admin)
        ->post('/cms/users', [
            'name' => 'Internal Editor',
            'email' => 'internal-editor@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'email_verified' => true,
            'roles' => ['editor'],
        ]);

    $response->assertRedirect('/cms/users');

    $user = User::query()->where('email', 'internal-editor@example.com')->firstOrFail();

    expect($user->name)->toBe('Internal Editor')
        ->and($user->email_verified_at)->not->toBeNull()
        ->and($user->hasRole('editor'))->toBeTrue()
        ->and($user->roles()->pluck('name')->all())->toBe(['editor']);
});

test('admin can update user profile data and sync assigned roles', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $user = User::factory()->unverified()->create([
        'name' => 'Original Name',
        'email' => 'original@example.com',
    ]);
    $user->assignRole('staff');

    $this->actingAs($admin)
        ->patch("/cms/users/{$user->id}", [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'password' => '',
            'password_confirmation' => '',
            'email_verified' => true,
            'roles' => ['editor'],
        ])
        ->assertRedirect('/cms/users');

    $user->refresh();

    expect($user->name)->toBe('Updated Name')
        ->and($user->email)->toBe('updated@example.com')
        ->and($user->email_verified_at)->not->toBeNull()
        ->and($user->hasRole('editor'))->toBeTrue()
        ->and($user->hasRole('staff'))->toBeFalse();
});

test('staff users cannot access the cms user management routes', function () {
    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $target = User::factory()->create();

    $this->actingAs($staff)
        ->get('/cms/users')
        ->assertForbidden();

    $this->actingAs($staff)
        ->patch("/cms/users/{$target->id}", [
            'name' => 'Blocked',
            'email' => 'blocked@example.com',
            'email_verified' => false,
        ])
        ->assertForbidden();
});

test('admin cannot elevate their own account to super admin', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->patch("/cms/users/{$admin->id}", [
            'name' => $admin->name,
            'email' => $admin->email,
            'email_verified' => true,
            'roles' => ['admin', 'super-admin'],
        ])
        ->assertForbidden();

    expect($admin->fresh()->hasRole('super-admin'))->toBeFalse()
        ->and($admin->fresh()->hasRole('admin'))->toBeTrue();
});
