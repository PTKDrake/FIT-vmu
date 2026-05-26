<?php

use App\Models\Post;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('cms posts index filters sorts and paginates rows from backend props', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $otherAuthor = User::factory()->create([
        'name' => 'Nguyen Van B',
    ]);

    $matchingAuthor = User::factory()->create([
        'name' => 'Tran Thi A',
    ]);

    Post::factory()->for($otherAuthor, 'author')->create([
        'title' => 'Tin nhap khong hien thi',
        'slug' => 'tin-nhap-khong-hien-thi',
        'status' => 'draft',
        'excerpt' => 'Khong trung bo loc',
        'created_at' => now()->subDay(),
    ]);

    foreach (range(1, 11) as $index) {
        Post::factory()->for($matchingAuthor, 'author')->create([
            'title' => sprintf('Thong bao FIT %02d', $index),
            'slug' => sprintf('thong-bao-fit-%02d', $index),
            'status' => 'published',
            'excerpt' => 'Du lieu cho bang CMS',
            'published_at' => now()->subDays($index),
            'created_at' => now()->subMinutes($index - 1),
            'author_id' => $matchingAuthor->getKey(),
        ]);
    }

    $this->actingAs($editor);

    $this->get('/cms/posts?search=FIT&status=published&sort=title&direction=asc&page=2&perPage=10')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/posts/index')
            ->has('posts.data', 1)
            ->where('posts.data.0.title', 'Thong bao FIT 11')
            ->where('posts.data.0.authorName', 'Tran Thi A')
            ->where('posts.meta.currentPage', 2)
            ->where('posts.meta.lastPage', 2)
            ->where('posts.meta.perPage', 10)
            ->where('posts.meta.total', 11)
        );
});
