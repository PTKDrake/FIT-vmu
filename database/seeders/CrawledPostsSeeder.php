<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CrawledPostsSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
            MediaSeeder::class,
            PostCategorySeeder::class,
            CrawledPostCategorySeeder::class,
            IntroPostsSeeder::class,
            DonViAndChuyenNganhSeeder::class,
        ]);
    }
}
