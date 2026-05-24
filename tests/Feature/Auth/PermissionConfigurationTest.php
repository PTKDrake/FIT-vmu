<?php

use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Role;

test('spatie permission is configured for the user model', function () {
    expect(config('auth.defaults.guard'))->toBe('web')
        ->and(config('permission.teams'))->toBeFalse()
        ->and(Schema::hasTable('roles'))->toBeTrue()
        ->and(Schema::hasTable('permissions'))->toBeTrue()
        ->and(Schema::hasTable('model_has_roles'))->toBeTrue()
        ->and(Schema::hasTable('model_has_permissions'))->toBeTrue()
        ->and(Schema::hasTable('role_has_permissions'))->toBeTrue()
        ->and(Schema::hasColumn('users', 'role'))->toBeFalse()
        ->and(Schema::hasColumn('users', 'is_admin'))->toBeFalse();

    $user = User::factory()->create();
    $role = Role::findOrCreate('admin', 'web');

    $user->assignRole($role);

    expect($user->fresh()->hasRole('admin'))->toBeTrue()
        ->and($user->fresh()->getRoleNames()->all())->toBe(['admin']);
});
