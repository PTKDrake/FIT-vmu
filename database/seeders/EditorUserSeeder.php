<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EditorUserSeeder extends Seeder
{
    /**
     * @var array<int, array{name: string, email: string}>
     */
    private const EDITORS = [
        [
            'name' => 'Biên tập viên 1',
            'email' => 'editor-1@vimaru.edu.vn',
        ],
        [
            'name' => 'Biên tập viên 2',
            'email' => 'editor-2@vimaru.edu.vn',
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = config('services.admin_seed_password');

        if (! is_string($password) || trim($password) === '') {
            $this->command->warn('Bỏ qua seed editor vì chưa cấu hình ADMIN_SEED_PASSWORD.');

            return;
        }

        $this->call(RoleAndPermissionSeeder::class);

        foreach (self::EDITORS as $editor) {
            $user = User::query()->updateOrCreate(
                ['email' => $editor['email']],
                [
                    'name' => $editor['name'],
                    'password' => Hash::make($password),
                    'email_verified_at' => now(),
                ],
            );

            $user->assignRole('editor');
        }

        $this->command->info('Hai tài khoản editor đã sẵn sàng.');
    }
}
