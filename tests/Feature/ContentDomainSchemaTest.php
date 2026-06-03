<?php

use App\Models\Media;
use App\Models\Post;
use App\Models\StaffProfile;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;

test('content domain tables expose the expected domain columns', function () {
    expect(Schema::hasColumns('media', [
        'id',
        'disk',
        'path',
        'original_name',
        'display_name',
        'mime_type',
        'size',
        'uploaded_by',
        'created_at',
        'updated_at',
    ]))->toBeTrue()
        ->and(Schema::hasColumns('posts', [
            'id',
            'title',
            'slug',
            'excerpt',
            'content',
            'content_format',
            'visibility',
            'thumbnail_id',
            'author_id',
            'status',
            'published_at',
            'created_at',
            'updated_at',
        ]))->toBeTrue();
});

test('post defaults follow the blocknote-first content convention', function () {
    $author = User::factory()->create();

    $post = Post::query()->create([
        'title' => 'Thong bao tuyen sinh',
        'slug' => 'thong-bao-tuyen-sinh',
        'author_id' => $author->id,
    ])->refresh();

    expect($post->content)->toBeNull()
        ->and($post->content_format)->toBe('blocknote_json')
        ->and($post->visibility)->toBe('public')
        ->and($post->status)->toBe('draft')
        ->and($post->published_at)->toBeNull();
});

test('content models resolve ownership and file relationships', function () {
    $author = User::factory()->create();
    $uploader = User::factory()->create();
    $thumbnail = Media::factory()->for($uploader, 'uploadedBy')->create();

    $post = Post::factory()->for($author, 'author')->for($thumbnail, 'thumbnail')->create([
        'published_at' => '2026-05-20 08:30:00',
    ]);

    $staffProfile = StaffProfile::factory()->for($uploader)->create([
        'avatar_id' => $thumbnail->id,
    ]);

    expect($post->author->is($author))->toBeTrue()
        ->and($post->thumbnail?->is($thumbnail))->toBeTrue()
        ->and($author->authoredPosts)->toHaveCount(1)
        ->and($post->published_at)->toBeInstanceOf(Carbon::class)
        ->and($thumbnail->uploadedBy->is($uploader))->toBeTrue()
        ->and($uploader->uploadedMedia)->toHaveCount(1)
        ->and($staffProfile->avatar?->is($thumbnail))->toBeTrue();
});

test('post slugs and media paths stay unique', function () {
    $post = Post::factory()->create([
        'slug' => 'tin-tuc-moi',
    ]);

    $media = Media::factory()->create([
        'path' => 'uploads/2026/05/tin-tuc-moi.jpg',
    ]);

    expect(fn () => Post::factory()->create([
        'slug' => $post->slug,
    ]))->toThrow(QueryException::class)
        ->and(fn () => Media::factory()->create([
            'path' => $media->path,
        ]))->toThrow(QueryException::class);
});
