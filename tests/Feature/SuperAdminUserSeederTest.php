<?php

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\SuperAdminUserSeeder;
use Illuminate\Support\Facades\Hash;

test('super admin user seeder creates and updates the seeded account when password is configured', function () {
    config()->set('app.env', 'local');
    putenv('ADMIN_SEED_PASSWORD=SeededPassword#2026');
    $_ENV['ADMIN_SEED_PASSWORD'] = 'SeededPassword#2026';
    $_SERVER['ADMIN_SEED_PASSWORD'] = 'SeededPassword#2026';

    $this->seed(SuperAdminUserSeeder::class);

    $user = User::query()->where('email', 'super-admin@vmufit.local')->first();

    expect($user)->not->toBeNull()
        ->and($user?->name)->toBe('Super Admin')
        ->and($user?->hasRole('super-admin'))->toBeTrue()
        ->and($user?->email_verified_at)->not->toBeNull()
        ->and(Hash::check('SeededPassword#2026', $user?->password ?? ''))->toBeTrue();

    putenv('ADMIN_SEED_PASSWORD=UpdatedSeedPassword#2026');
    $_ENV['ADMIN_SEED_PASSWORD'] = 'UpdatedSeedPassword#2026';
    $_SERVER['ADMIN_SEED_PASSWORD'] = 'UpdatedSeedPassword#2026';

    $this->seed(SuperAdminUserSeeder::class);

    $updatedUser = $user?->fresh();

    expect(User::query()->where('email', 'super-admin@vmufit.local')->count())->toBe(1)
        ->and(Hash::check('UpdatedSeedPassword#2026', $updatedUser?->password ?? ''))->toBeTrue();
});

test('super admin user seeder skips creation when password is missing', function () {
    putenv('ADMIN_SEED_PASSWORD');
    unset($_ENV['ADMIN_SEED_PASSWORD'], $_SERVER['ADMIN_SEED_PASSWORD']);

    $this->seed(SuperAdminUserSeeder::class);

    expect(User::query()->where('email', 'super-admin@vmufit.local')->exists())->toBeFalse();
});

test('database seeder creates a reusable admin account without duplicate emails', function () {
    putenv('ADMIN_SEED_PASSWORD=SeededPassword#2026');
    $_ENV['ADMIN_SEED_PASSWORD'] = 'SeededPassword#2026';
    $_SERVER['ADMIN_SEED_PASSWORD'] = 'SeededPassword#2026';

    $this->seed(DatabaseSeeder::class);
    $this->seed(DatabaseSeeder::class);

    $admin = User::query()->where('email', 'admin@example.com')->first();

    expect($admin)->not->toBeNull()
        ->and($admin?->name)->toBe('Admin')
        ->and($admin?->hasRole('admin'))->toBeTrue()
        ->and(User::query()->where('email', 'admin@example.com')->count())->toBe(1)
        ->and(User::query()->where('email', 'super-admin@vmufit.local')->count())->toBe(1);
});
