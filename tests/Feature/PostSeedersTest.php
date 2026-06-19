<?php

declare(strict_types=1);

use App\Models\Post;
use App\Models\PostCategory;
use Database\Seeders\PostCategorySeeder;
use Database\Seeders\PostSeeder;

test('post category seeder creates the new public category tree', function () {
    $this->seed(PostCategorySeeder::class);

    $categories = PostCategory::query()->orderBy('sort_order')->orderBy('id')->get();

    expect($categories)->toHaveCount(10)
        ->and($categories->whereNull('parent_id')->pluck('slug')->all())->toBe([
            'don-vi',
            'chuyen-nganh',
            'tuyen-sinh',
            'tin-tuc',
            'thong-bao',
        ]);

    $tinTuc = PostCategory::query()->where('slug', 'tin-tuc')->firstOrFail();

    expect($tinTuc->children()->orderBy('sort_order')->pluck('slug')->all())->toBe([
        'su-kien',
        'nghien-cuu-khoa-hoc',
        'tin-don-vi',
        'hoat-dong-sinh-vien',
        'tuyen-dung',
    ]);
});

test('post seeder no longer creates seeded posts', function () {
    $this->seed(PostCategorySeeder::class);
    $this->seed(PostSeeder::class);

    expect(Post::query()->count())->toBe(0);
});
