<?php

declare(strict_types=1);

namespace App\QueryBuilders;

use App\Models\Post;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

final class CmsPostsQueryBuilder
{
    /** @return QueryBuilder<Post> */
    public static function make(?Request $request = null): QueryBuilder
    {
        return QueryBuilder::for(Post::query(), $request)
            ->allowedFilters(
                AllowedFilter::callback('search', self::searchFilter(...)),
                AllowedFilter::exact('status'),
                AllowedFilter::exact('author_id'),
            )
            ->allowedSorts(
                'title',
                'status',
                'published_at',
                'created_at',
                AllowedSort::field('author', 'author_id'),
            )
            ->allowedIncludes(
                'author',
                'thumbnail',
            )
            ->defaultSort('-created_at');
    }

    /** @param Builder<Post> $query */
    private static function searchFilter(Builder $query, mixed $value): void
    {
        if (! is_scalar($value)) {
            return;
        }

        $searchTerm = trim((string) $value);

        if ($searchTerm === '') {
            return;
        }

        $query->where(function (Builder $query) use ($searchTerm): void {
            $query
                ->where('title', 'like', "%{$searchTerm}%")
                ->orWhere('slug', 'like', "%{$searchTerm}%")
                ->orWhere('excerpt', 'like', "%{$searchTerm}%");
        });
    }
}
