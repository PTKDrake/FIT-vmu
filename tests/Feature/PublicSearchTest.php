<?php

use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;

test('public search returns matching pages posts and categories', function () {
    $page = Page::factory()->create([
        'title' => 'Tuyen sinh cong nghe thong tin',
        'slug' => 'tuyen-sinh-cong-nghe-thong-tin',
        'excerpt' => 'Thong tin tuyen sinh moi nhat',
        'visibility' => 'public',
        'published_at' => now(),
    ]);

    $category = PostCategory::factory()->create([
        'name' => 'Tuyen sinh',
        'slug' => 'tuyen-sinh',
        'description' => 'Danh muc tuyen sinh',
        'is_active' => true,
    ]);

    $post = Post::factory()->create([
        'title' => 'Thong bao tuyen sinh dai hoc',
        'slug' => 'thong-bao-tuyen-sinh-dai-hoc',
        'excerpt' => 'Chi tiet thong bao tuyen sinh',
        'status' => 'published',
        'visibility' => 'public',
        'published_at' => now(),
    ]);
    $post->categories()->sync([$category->id]);

    $this->getJson('/search?q=tuyen')
        ->assertOk()
        ->assertJsonPath('query', 'tuyen')
        ->assertJsonFragment([
            'type' => 'page',
            'title' => $page->title,
            'url' => "/{$page->slug}",
        ])
        ->assertJsonFragment([
            'type' => 'post',
            'title' => $post->title,
            'url' => "/{$category->slug}/{$post->slug}",
        ])
        ->assertJsonFragment([
            'type' => 'category',
            'title' => $category->name,
            'url' => "/{$category->slug}",
        ]);
});

test('public search matches page and post title description and slug', function () {
    $descriptionPage = Page::factory()->create([
        'title' => 'Trang gioi thieu khoa',
        'slug' => 'gioi-thieu-khoa',
        'excerpt' => null,
        'seo_description' => 'Thong tin ve chuong trinh dao tao logistics so',
        'visibility' => 'public',
        'published_at' => now(),
    ]);

    $slugPage = Page::factory()->create([
        'title' => 'Trang noi dung khac',
        'slug' => 'phong-thi-nghiem-ai',
        'excerpt' => 'Khong trung keyword',
        'seo_description' => null,
        'visibility' => 'public',
        'published_at' => now(),
    ]);

    $category = PostCategory::factory()->create([
        'name' => 'Tin cong nghe',
        'slug' => 'tin-cong-nghe',
        'is_active' => true,
    ]);

    $descriptionPost = Post::factory()->create([
        'title' => 'Thong bao sinh vien',
        'slug' => 'thong-bao-sinh-vien',
        'excerpt' => 'Noi dung ve hoc bong AI va du lieu',
        'status' => 'published',
        'visibility' => 'public',
        'published_at' => now(),
    ]);
    $descriptionPost->categories()->sync([$category->id]);

    $slugPost = Post::factory()->create([
        'title' => 'Bai viet khac',
        'slug' => 'lich-thuc-tap-doanh-nghiep',
        'excerpt' => 'Khong trung keyword',
        'status' => 'published',
        'visibility' => 'public',
        'published_at' => now(),
    ]);
    $slugPost->categories()->sync([$category->id]);

    $this->getJson('/search?q=logistics')
        ->assertOk()
        ->assertJsonFragment([
            'type' => 'page',
            'title' => $descriptionPage->title,
            'description' => $descriptionPage->seo_description,
        ]);

    $this->getJson('/search?q=phong-thi-nghiem')
        ->assertOk()
        ->assertJsonFragment([
            'type' => 'page',
            'title' => $slugPage->title,
            'url' => "/{$slugPage->slug}",
        ]);

    $this->getJson('/search?q=hoc bong')
        ->assertOk()
        ->assertJsonFragment([
            'type' => 'post',
            'title' => $descriptionPost->title,
            'description' => $descriptionPost->excerpt,
        ]);

    $this->getJson('/search?q=thuc-tap')
        ->assertOk()
        ->assertJsonFragment([
            'type' => 'post',
            'title' => $slugPost->title,
            'url' => "/{$category->slug}/{$slugPost->slug}",
        ]);
});

test('public search excludes unpublished inactive and inaccessible content', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    Page::factory()->create([
        'title' => 'Noi bo quan tri tuyen sinh',
        'slug' => 'noi-bo-quan-tri-tuyen-sinh',
        'visibility' => 'hidden',
        'published_at' => now(),
    ]);

    Page::factory()->create([
        'title' => 'Chua xuat ban tuyen sinh',
        'slug' => 'chua-xuat-ban-tuyen-sinh',
        'visibility' => 'public',
        'published_at' => null,
    ]);

    $inactiveCategory = PostCategory::factory()->create([
        'name' => 'Tuyen sinh an',
        'slug' => 'tuyen-sinh-an',
        'is_active' => false,
    ]);

    $draftPost = Post::factory()->create([
        'title' => 'Ban nhap tuyen sinh',
        'slug' => 'ban-nhap-tuyen-sinh',
        'status' => 'draft',
        'visibility' => 'public',
        'published_at' => now(),
    ]);
    $draftPost->categories()->sync([$inactiveCategory->id]);

    $this->getJson('/search?q=tuyen')
        ->assertOk()
        ->assertJsonMissing(['title' => 'Noi bo quan tri tuyen sinh'])
        ->assertJsonMissing(['title' => 'Chua xuat ban tuyen sinh'])
        ->assertJsonMissing(['title' => 'Tuyen sinh an'])
        ->assertJsonMissing(['title' => 'Ban nhap tuyen sinh']);

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->getJson('/search?q=tuyen')
        ->assertOk()
        ->assertJsonFragment(['title' => 'Noi bo quan tri tuyen sinh']);
});

test('public search requires at least two characters', function () {
    Page::factory()->create([
        'title' => 'Tuyen sinh',
        'published_at' => now(),
    ]);

    $this->getJson('/search?q=t')
        ->assertOk()
        ->assertJsonPath('query', 't')
        ->assertJsonPath('results', []);
});
