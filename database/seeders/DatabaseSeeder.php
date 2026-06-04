<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
            SuperAdminUserSeeder::class,
            UnitsAndPositionsSeeder::class,
            StaffProfileSeeder::class,
        ]);

        User::factory()->count(10)->createMany();

        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@vimaru.edu.vn'],
            [
                'name' => 'Quản trị viên',
                'email_verified_at' => now(),
                'password' => User::factory()->makeOne()->password,
                'remember_token' => Str::random(10),
            ],
        );

        $admin->assignRole('admin');

        $this->call([
            MediaSeeder::class,
            PostCategorySeeder::class,
            PostSeeder::class,
            IntroPostsSeeder::class,
            DefaultSiteLayoutSeeder::class,
            HomepageSeeder::class,
            NavigationSeeder::class,
            StudentGroupSeeder::class,
            SiteSettingsSeeder::class,
        ]);
    }
}
