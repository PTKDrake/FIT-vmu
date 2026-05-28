<?php

use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Database\Seeders\PostCategorySeeder;
use Database\Seeders\PostSeeder;
use Database\Seeders\RoleAndPermissionSeeder;

test('post category seeder creates a stable category tree without duplicates', function () {
    $this->seed(PostCategorySeeder::class);
    $this->seed(PostCategorySeeder::class);

    $categories = PostCategory::query()->orderBy('sort_order')->get();

    expect($categories)->toHaveCount(8)
        ->and(PostCategory::query()->where('slug', 'tin-tuc')->count())->toBe(1)
        ->and(PostCategory::query()->where('slug', 'su-kien')->count())->toBe(1)
        ->and(PostCategory::query()->where('slug', 'hop-tac-quoc-te')->count())->toBe(1);

    $newsCategory = PostCategory::query()->where('slug', 'tin-tuc')->firstOrFail();

    expect($newsCategory->children()->pluck('slug')->all())
        ->toBe(['su-kien', 'hop-tac-quoc-te']);
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
        ->and($orientationPost?->categories->pluck('slug')->all())->toBe(['tin-tuc', 'su-kien', 'sinh-vien'])
        ->and($researchPost?->categories->pluck('slug')->all())->toBe(['tin-tuc', 'nghien-cuu-khoa-hoc', 'sinh-vien'])
        ->and(User::query()->where('email', 'content-seeder@vmufit.local')->count())->toBeLessThanOrEqual(1);
});
