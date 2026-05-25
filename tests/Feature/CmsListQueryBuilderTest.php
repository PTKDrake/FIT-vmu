<?php

use App\Models\Document;
use App\Models\Post;
use App\Models\User;
use App\QueryBuilders\CmsDocumentsQueryBuilder;
use App\QueryBuilders\CmsPostsQueryBuilder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\Exceptions\InvalidFilterQuery;
use Spatie\QueryBuilder\Exceptions\InvalidSortQuery;

test('cms posts query builder applies allowed filters sorts and includes', function () {
    $matchingAuthor = User::factory()->create();
    $otherAuthor = User::factory()->create();

    Post::factory()->for($otherAuthor, 'author')->create([
        'title' => 'Beta post',
        'slug' => 'beta-post',
        'excerpt' => 'Filtered out by status',
        'status' => 'draft',
        'created_at' => now()->subDay(),
    ]);

    Post::factory()->for($matchingAuthor, 'author')->create([
        'title' => 'Alpha VMU post',
        'slug' => 'alpha-vmu-post',
        'excerpt' => 'Matches the CMS keyword search',
        'status' => 'published',
        'created_at' => now(),
    ]);

    bindQueryBuilderRequest([
        'filter' => [
            'search' => 'VMU',
            'status' => 'published',
            'author_id' => (string) $matchingAuthor->getKey(),
        ],
        'sort' => 'title',
        'include' => 'author',
    ]);

    $posts = CmsPostsQueryBuilder::make()->get();

    expect($posts)->toHaveCount(1)
        ->and($posts->first()?->title)->toBe('Alpha VMU post')
        ->and($posts->first()?->relationLoaded('author'))->toBeTrue();
});

test('cms documents query builder applies allowed filters sorts and includes', function () {
    $matchingOwner = User::factory()->create();
    $otherOwner = User::factory()->create();

    Document::factory()->for($otherOwner, 'owner')->create([
        'title' => 'Internal exam memo',
        'slug' => 'internal-exam-memo',
        'status' => 'draft',
        'visibility' => 'private',
        'document_type' => 'exam',
        'document_mode' => 'preview',
        'created_at' => now()->subDay(),
    ]);

    Document::factory()->for($matchingOwner, 'owner')->create([
        'title' => 'Public lecture outline',
        'slug' => 'public-lecture-outline',
        'status' => 'published',
        'visibility' => 'public',
        'document_type' => 'lecture',
        'document_mode' => 'file',
        'created_at' => now(),
    ]);

    bindQueryBuilderRequest([
        'filter' => [
            'search' => 'lecture',
            'status' => 'published',
            'visibility' => 'public',
            'document_type' => 'lecture',
            'document_mode' => 'file',
            'owner_id' => (string) $matchingOwner->getKey(),
        ],
        'sort' => '-created_at',
        'include' => 'owner',
    ]);

    $documents = CmsDocumentsQueryBuilder::make()->get();

    expect($documents)->toHaveCount(1)
        ->and($documents->first()?->title)->toBe('Public lecture outline')
        ->and($documents->first()?->relationLoaded('owner'))->toBeTrue();
});

test('cms posts query builder rejects unknown filters', function () {
    bindQueryBuilderRequest([
        'filter' => [
            'visibility' => 'public',
        ],
    ]);

    CmsPostsQueryBuilder::make()->get();
})->throws(InvalidFilterQuery::class);

test('cms documents query builder rejects unknown sorts', function () {
    bindQueryBuilderRequest([
        'sort' => 'author_name',
    ]);

    CmsDocumentsQueryBuilder::make()->get();
})->throws(InvalidSortQuery::class);

test('cms query builders default to newest records first', function () {
    $olderPost = Post::factory()->create([
        'title' => 'Older post',
        'created_at' => now()->subDays(2),
    ]);

    $newerPost = Post::factory()->create([
        'title' => 'Newer post',
        'created_at' => now(),
    ]);

    bindQueryBuilderRequest();

    $posts = CmsPostsQueryBuilder::make()->get();

    expect($posts->pluck('id')->all())->toBe([
        $newerPost->getKey(),
        $olderPost->getKey(),
    ]);
});

function bindQueryBuilderRequest(array $query = []): void
{
    $request = Request::create('/cms', 'GET', $query);

    app()->instance('request', $request);
}
