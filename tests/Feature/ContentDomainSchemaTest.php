<?php

use App\Models\Document;
use App\Models\DocumentRow;
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
        ]))->toBeTrue()
        ->and(Schema::hasColumns('documents', [
            'id',
            'title',
            'slug',
            'description',
            'description_format',
            'file_id',
            'owner_id',
            'document_type',
            'visibility',
            'status',
            'document_mode',
            'published_at',
            'created_at',
            'updated_at',
        ]))->toBeTrue()
        ->and(Schema::hasColumns('document_rows', [
            'id',
            'document_id',
            'student_code',
            'data',
            'row_index',
            'created_at',
            'updated_at',
        ]))->toBeTrue();
});

test('post and document defaults follow the blocknote-first content convention', function () {
    $author = User::factory()->create();
    $owner = User::factory()->create();

    $post = Post::query()->create([
        'title' => 'Thong bao tuyen sinh',
        'slug' => 'thong-bao-tuyen-sinh',
        'author_id' => $author->id,
    ])->refresh();

    $document = Document::query()->create([
        'title' => 'De cuong hoc phan',
        'slug' => 'de-cuong-hoc-phan',
        'owner_id' => $owner->id,
        'document_type' => 'lecture',
    ])->refresh();

    expect($post->content)->toBeNull()
        ->and($post->content_format)->toBe('blocknote_json')
        ->and($post->visibility)->toBe('public')
        ->and($post->status)->toBe('draft')
        ->and($post->published_at)->toBeNull()
        ->and($document->description)->toBeNull()
        ->and($document->description_format)->toBe('blocknote_json')
        ->and($document->visibility)->toBe('private')
        ->and($document->status)->toBe('draft')
        ->and($document->document_mode)->toBe('file')
        ->and($document->published_at)->toBeNull();
});

test('content models resolve ownership file and row relationships', function () {
    $author = User::factory()->create();
    $owner = User::factory()->create();
    $uploader = User::factory()->create();
    $thumbnail = Media::factory()->for($uploader, 'uploadedBy')->create();
    $file = Media::factory()->for($uploader, 'uploadedBy')->create();

    $post = Post::factory()->for($author, 'author')->for($thumbnail, 'thumbnail')->create([
        'published_at' => '2026-05-20 08:30:00',
    ]);

    $document = Document::factory()->for($owner, 'owner')->for($file, 'file')->create();
    $row = DocumentRow::factory()->for($document)->create([
        'student_code' => '123456',
        'data' => [
            'student_code' => '123456',
            'score' => 95,
        ],
        'row_index' => 12,
    ]);

    $staffProfile = StaffProfile::factory()->for($uploader)->create([
        'avatar_id' => $thumbnail->id,
    ]);

    expect($post->author->is($author))->toBeTrue()
        ->and($post->thumbnail?->is($thumbnail))->toBeTrue()
        ->and($author->authoredPosts)->toHaveCount(1)
        ->and($post->published_at)->toBeInstanceOf(Carbon::class)
        ->and($document->owner->is($owner))->toBeTrue()
        ->and($document->file?->is($file))->toBeTrue()
        ->and($owner->ownedDocuments)->toHaveCount(1)
        ->and($document->rows)->toHaveCount(1)
        ->and($row->document->is($document))->toBeTrue()
        ->and($row->data)->toBe([
            'student_code' => '123456',
            'score' => 95,
        ])
        ->and($row->row_index)->toBe(12)
        ->and($thumbnail->uploadedBy->is($uploader))->toBeTrue()
        ->and($uploader->uploadedMedia)->toHaveCount(2)
        ->and($staffProfile->avatar?->is($thumbnail))->toBeTrue();
});

test('post slugs document slugs and media paths stay unique', function () {
    $post = Post::factory()->create([
        'slug' => 'tin-tuc-moi',
    ]);

    $document = Document::factory()->create([
        'slug' => 'de-thi-cuoi-ky',
    ]);

    $media = Media::factory()->create([
        'path' => 'uploads/2026/05/de-thi-cuoi-ky.pdf',
    ]);

    expect(fn () => Post::factory()->create([
        'slug' => $post->slug,
    ]))->toThrow(QueryException::class)
        ->and(fn () => Document::factory()->create([
            'slug' => $document->slug,
        ]))->toThrow(QueryException::class)
        ->and(fn () => Media::factory()->create([
            'path' => $media->path,
        ]))->toThrow(QueryException::class);
});
