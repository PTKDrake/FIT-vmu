<?php

use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Database\Seeders\DonViAndChuyenNganhSeeder;
use Database\Seeders\PostCategorySeeder;
use Database\Seeders\PostSeeder;
use Database\Seeders\RoleAndPermissionSeeder;

test('post category seeder creates a stable category tree without duplicates', function () {
    $this->seed(PostCategorySeeder::class);
    $this->seed(PostCategorySeeder::class);

    $categories = PostCategory::query()->orderBy('sort_order')->get();

    expect($categories)->toHaveCount(19)
        ->and(PostCategory::query()->where('slug', 'thong-bao')->count())->toBe(1)
        ->and(PostCategory::query()->where('slug', 'kien-thuc-nckh')->count())->toBe(1)
        ->and(PostCategory::query()->where('slug', 'cong-bo-khoa-hoc')->count())->toBe(1);

    $nckhCategory = PostCategory::query()->where('slug', 'nghien-cuu-khoa-hoc')->firstOrFail();

    expect($nckhCategory->children()->pluck('slug')->all())
        ->toBe(['kien-thuc-nckh', 'cac-nha-khoa-hoc', 'cong-bo-khoa-hoc']);
});

test('post seeder creates reusable seeded posts with valid relations', function () {
    $this->seed(RoleAndPermissionSeeder::class);
    $this->seed(PostCategorySeeder::class);
    $this->seed(PostSeeder::class);
    $this->seed(PostSeeder::class);

    $posts = Post::query()
        ->with(['author', 'categories'])
        ->orderBy('slug')
        ->get();

    expect($posts)->toHaveCount(6)
        ->and($posts->pluck('slug')->unique())->toHaveCount(6)
        ->and($posts->every(fn (Post $post): bool => $post->author instanceof User))->toBeTrue()
        ->and($posts->every(fn (Post $post): bool => $post->categories->isNotEmpty()))->toBeTrue()
        ->and($posts->every(fn (Post $post): bool => $post->content_format === 'blocknote_json'))->toBeTrue();

    $orientationPost = $posts->firstWhere('slug', 'vmu-khai-truong-chuoi-hoat-dong-chao-don-tan-sinh-vien');
    $researchPost = $posts->firstWhere('slug', 'nhom-nghien-cuu-sinh-vien-cong-bo-giai-phap-mo-phong-cang-thong-minh');

    $publishedPosts = $posts->where('status', 'published');

    expect($publishedPosts)->not->toBeEmpty()
        ->and($publishedPosts->every(fn (Post $post): bool => $post->published_at !== null))->toBeTrue()
        ->and($posts->contains(fn (Post $post): bool => $post->categories->count() > 1))->toBeTrue()
        ->and($orientationPost?->categories->pluck('slug')->all())->toBe(['thong-bao', 'tin-don-vi', 'doan-thanh-nien'])
        ->and($researchPost?->categories->pluck('slug')->all())->toBe(['tin-don-vi', 'cau-lac-bo-nghien-cuu-khoa-hoc', 'nghien-cuu-khoa-hoc'])
        ->and(User::query()->where('email', 'content-seeder@vmufit.local')->count())->toBeLessThanOrEqual(1);
});

test('don vi and chuyen nganh seeder builds two parent categories with children and posts idempotently', function () {
    $this->seed(RoleAndPermissionSeeder::class);
    $this->seed(PostCategorySeeder::class);
    $this->seed(DonViAndChuyenNganhSeeder::class);
    $this->seed(DonViAndChuyenNganhSeeder::class);

    $donVi = PostCategory::query()->where('slug', 'don-vi')->firstOrFail();
    $chuyenNganh = PostCategory::query()->where('slug', 'chuyen-nganh')->firstOrFail();

    expect($donVi->children()->pluck('slug')->all())->toBe([
        'ban-chu-nhiem-khoa',
        'bo-mon-he-thong-thong-tin',
        'bo-mon-khoa-hoc-may-tinh',
        'bo-mon-ky-thuat-may-tinh',
        'bo-mon-tin-hoc-dai-cuong',
        'bo-mon-truyen-thong-va-mang-may-tinh',
        'ban-chap-hanh-cong-doan',
        'lien-chi-doan-khoa-cong-nghe-thong-tin',
    ])
        ->and($chuyenNganh->children()->pluck('slug')->all())->toBe([
            'cong-nghe-thong-tin',
            'cong-nghe-phan-mem',
            'truyen-thong-va-mang-may-tinh',
        ]);

    $unitPost = Post::query()->where('slug', 'don-vi-ban-chu-nhiem-khoa')->firstOrFail();
    $majorPost = Post::query()->where('slug', 'chuyen-nganh-cong-nghe-thong-tin')->firstOrFail();

    expect($unitPost->content_format)->toBe('blocknote_json')
        ->and($majorPost->content_format)->toBe('blocknote_json')
        ->and($unitPost->categories->pluck('slug')->all())->toContain('ban-chu-nhiem-khoa', 'don-vi')
        ->and($majorPost->categories->pluck('slug')->all())->toContain('cong-nghe-thong-tin', 'chuyen-nganh')
        ->and(Post::query()->where('slug', 'like', 'don-vi-%')->count())->toBe(8)
        ->and(Post::query()->where('slug', 'like', 'chuyen-nganh-%')->count())->toBe(3);

    $decoded = json_decode($unitPost->content, true, flags: JSON_THROW_ON_ERROR);

    expect($decoded)->toBeArray()
        ->and($decoded)->not->toBeEmpty()
        ->and($decoded[0]['type'] ?? null)->toBe('paragraph');
});
