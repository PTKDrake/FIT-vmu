<?php

use App\Models\Post;
use App\Models\User;
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

test('cms posts query builder search ignores vietnamese accents and letter case', function () {
    $matchingAuthor = User::factory()->create();

    Post::factory()->for($matchingAuthor, 'author')->create([
        'title' => 'Chương trình Đào tạo chất lượng cao',
        'slug' => 'chuong-trinh-dao-tao-chat-luong-cao',
        'excerpt' => 'Thông tin tuyển sinh mới',
        'status' => 'published',
    ]);

    Post::factory()->for($matchingAuthor, 'author')->create([
        'title' => 'Tin khác',
        'slug' => 'tin-khac',
        'excerpt' => 'Không liên quan',
        'status' => 'published',
    ]);

    bindQueryBuilderRequest([
        'filter' => [
            'search' => 'DAO TAO',
        ],
    ]);

    $posts = CmsPostsQueryBuilder::make()->get();

    expect($posts)->toHaveCount(1)
        ->and($posts->first()?->title)->toBe('Chương trình Đào tạo chất lượng cao');
});

test('cms posts query builder rejects unknown filters', function () {
    bindQueryBuilderRequest([
        'filter' => [
            'visibility' => 'public',
        ],
    ]);

    CmsPostsQueryBuilder::make()->get();
})->throws(InvalidFilterQuery::class);

test('cms posts query builder rejects unknown sorts', function () {
    bindQueryBuilderRequest([
        'sort' => 'category_name',
    ]);

    CmsPostsQueryBuilder::make()->get();
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
