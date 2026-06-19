<?php

declare(strict_types=1);

use App\Models\Post;
use Database\Seeders\PostSeeder;

test('post seeder is idempotent for crawl-based posts', function () {
    $this->seed(PostSeeder::class);
    $this->seed(PostSeeder::class);

    expect(Post::query()->count())->toBe(48)
        ->and(Post::query()->where('slug', 'gioi-thieu-khoa-cong-nghe-thong-tin')->count())->toBe(1)
        ->and(Post::query()->where('slug', 'don-vi-ban-chu-nhiem-khoa')->count())->toBe(1)
        ->and(Post::query()->where('slug', 'hoi-thi-sinh-vien-voi-toan-khong-gian-mang-nam-2025')->count())->toBe(1);
});
