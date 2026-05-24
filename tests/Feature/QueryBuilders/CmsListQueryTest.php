<?php

declare(strict_types=1);

use App\Models\Document;
use App\Models\Post;
use App\Models\User;
use App\QueryBuilders\CmsDocumentsQuery;
use App\QueryBuilders\CmsPostsQuery;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\Exceptions\InvalidFilterQuery;
use Spatie\QueryBuilder\Exceptions\InvalidIncludeQuery;
use Spatie\QueryBuilder\Exceptions\InvalidSortQuery;

test('cms posts query only applies allowed filters sorts and includes', function (): void {
    $authorA = User::factory()->create();
    $authorB = User::factory()->create();

    $firstPost = Post::factory()->for($authorA, 'author')->create([
        'title' => 'Alpha post',
        'slug' => 'alpha-post',
        'status' => 'published',
        'created_at' => now()->subDay(),
    ]);
    $secondPost = Post::factory()->for($authorB, 'author')->create([
        'title' => 'Beta post',
        'slug' => 'beta-post',
        'status' => 'draft',
        'created_at' => now(),
    ]);

    $request = Request::create('/cms/posts', 'GET', [
        'filter' => [
            'search' => 'Alpha',
            'status' => 'published',
            'author' => (string) $authorA->id,
        ],
        'sort' => 'title',
        'include' => 'author,thumbnail',
    ]);

    $posts = CmsPostsQuery::make($request)->get();

    expect($posts->pluck('id')->all())->toBe([$firstPost->id])
        ->and($posts->first()?->relationLoaded('author'))->toBeTrue()
        ->and($posts->first()?->relationLoaded('thumbnail'))->toBeTrue()
        ->and($posts->contains($secondPost))->toBeFalse();
});

test('cms posts query rejects disallowed filters', function (): void {
    $request = Request::create('/cms/posts', 'GET', [
        'filter' => [
            'visibility' => 'public',
        ],
    ]);

    expect(fn () => CmsPostsQuery::make($request)->get())
        ->toThrow(InvalidFilterQuery::class);
});

test('cms documents query only applies allowed filters sorts and includes', function (): void {
    $ownerA = User::factory()->create();
    $ownerB = User::factory()->create();

    $firstDocument = Document::factory()->for($ownerA, 'owner')->create([
        'title' => 'Student handbook',
        'slug' => 'student-handbook',
        'document_type' => 'form',
        'visibility' => 'students',
        'document_mode' => 'file',
        'status' => 'published',
        'created_at' => now()->subDay(),
    ]);
    $secondDocument = Document::factory()->for($ownerB, 'owner')->create([
        'title' => 'Internal memo',
        'slug' => 'internal-memo',
        'document_type' => 'announcement',
        'visibility' => 'private',
        'document_mode' => 'preview',
        'status' => 'draft',
        'created_at' => now(),
    ]);

    $request = Request::create('/cms/documents', 'GET', [
        'filter' => [
            'search' => 'handbook',
            'visibility' => 'students',
            'document_type' => 'form',
            'document_mode' => 'file',
            'owner' => (string) $ownerA->id,
        ],
        'sort' => 'title',
        'include' => 'owner,file,rows',
    ]);

    $documents = CmsDocumentsQuery::make($request)->get();

    expect($documents->pluck('id')->all())->toBe([$firstDocument->id])
        ->and($documents->first()?->relationLoaded('owner'))->toBeTrue()
        ->and($documents->first()?->relationLoaded('file'))->toBeTrue()
        ->and($documents->first()?->relationLoaded('rows'))->toBeTrue()
        ->and($documents->contains($secondDocument))->toBeFalse();
});

test('cms documents query rejects disallowed sorts and includes', function (): void {
    $invalidSortRequest = Request::create('/cms/documents', 'GET', [
        'sort' => 'owner_id',
    ]);

    expect(fn () => CmsDocumentsQuery::make($invalidSortRequest)->get())
        ->toThrow(InvalidSortQuery::class);

    $invalidIncludeRequest = Request::create('/cms/documents', 'GET', [
        'include' => 'uploadedBy',
    ]);

    expect(fn () => CmsDocumentsQuery::make($invalidIncludeRequest)->get())
        ->toThrow(InvalidIncludeQuery::class);
});
