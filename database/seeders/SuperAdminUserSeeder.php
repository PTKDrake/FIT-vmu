<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminUserSeeder extends Seeder
{
    private const SUPER_ADMIN_EMAIL = 'super-admin@vimaru.edu.vn';

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = config('services.admin_seed_password');

        if (! is_string($password) || trim($password) === '') {
            $this->command->warn('Bỏ qua seed super-admin vì chưa cấu hình ADMIN_SEED_PASSWORD.');

            return;
        }

        $this->call(RoleAndPermissionSeeder::class);

        $user = User::query()->updateOrCreate(
            ['email' => self::SUPER_ADMIN_EMAIL],
            [
                'name' => 'Quản trị viên cấp cao',
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ],
        );

        $user->assignRole('super-admin');

        $this->command->info(sprintf('Tài khoản super-admin đã sẵn sàng: %s', self::SUPER_ADMIN_EMAIL));
    }
}
