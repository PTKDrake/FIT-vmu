<?php

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\SuperAdminUserSeeder;
use Illuminate\Support\Facades\Hash;

test('super admin user seeder creates and updates the seeded account when password is configured', function () {
    config()->set('app.env', 'local');
    config()->set('services.admin_seed_password', 'SeededPassword#2026');

    $this->seed(SuperAdminUserSeeder::class);

    $user = User::query()->where('email', 'super-admin@vimaru.edu.vn')->first();

    expect($user)->not->toBeNull()
        ->and($user?->name)->toBe('Quản trị viên cấp cao')
        ->and($user?->hasRole('super-admin'))->toBeTrue()
        ->and($user?->email_verified_at)->not->toBeNull()
        ->and(Hash::check('SeededPassword#2026', $user?->password ?? ''))->toBeTrue();

    config()->set('services.admin_seed_password', 'UpdatedSeedPassword#2026');

    $this->seed(SuperAdminUserSeeder::class);

    $updatedUser = $user?->fresh();

    expect(User::query()->where('email', 'super-admin@vimaru.edu.vn')->count())->toBe(1)
        ->and(Hash::check('UpdatedSeedPassword#2026', $updatedUser?->password ?? ''))->toBeTrue();
});

test('super admin user seeder skips creation when password is missing', function () {
    config()->set('services.admin_seed_password', null);

    $this->seed(SuperAdminUserSeeder::class);

    expect(User::query()->where('email', 'super-admin@vimaru.edu.vn')->exists())->toBeFalse();
});

test('database seeder creates a reusable admin account without duplicate emails', function () {
    config()->set('services.admin_seed_password', 'SeededPassword#2026');

    $this->seed(DatabaseSeeder::class);
    $this->seed(DatabaseSeeder::class);

    $admin = User::query()->where('email', 'admin@vimaru.edu.vn')->first();

    expect($admin)->not->toBeNull()
        ->and($admin?->name)->toBe('Quản trị viên')
        ->and($admin?->hasRole('admin'))->toBeTrue()
        ->and(User::query()->where('email', 'admin@vimaru.edu.vn')->count())->toBe(1)
        ->and(User::query()->where('email', 'super-admin@vimaru.edu.vn')->count())->toBe(1);
});
