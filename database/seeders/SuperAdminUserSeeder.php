<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminUserSeeder extends Seeder
{
    private const SUPER_ADMIN_EMAIL = 'super-admin@vmufit.local';

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = env('ADMIN_SEED_PASSWORD');

        if (! is_string($password) || trim($password) === '') {
            $this->command?->warn('Skipping super-admin seeding because ADMIN_SEED_PASSWORD is not set.');

            return;
        }

        $this->call(RoleAndPermissionSeeder::class);

        $user = User::query()->updateOrCreate(
            ['email' => self::SUPER_ADMIN_EMAIL],
            [
                'name' => 'Super Admin',
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ],
        );

        $user->assignRole('super-admin');

        $this->command?->info(sprintf('Super-admin account is ready: %s', self::SUPER_ADMIN_EMAIL));
    }
}
