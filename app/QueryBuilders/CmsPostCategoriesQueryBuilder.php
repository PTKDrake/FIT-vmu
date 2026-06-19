<?php

declare(strict_types=1);

namespace App\QueryBuilders;

use App\Models\PostCategory;
use App\Support\NormalizedSearch;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

final class CmsPostCategoriesQueryBuilder
{
    /** @return QueryBuilder<PostCategory> */
    public static function make(?Request $request = null): QueryBuilder
    {
        return QueryBuilder::for(PostCategory::query(), $request)
            ->allowedFilters(
                AllowedFilter::callback('search', self::searchFilter(...)),
                AllowedFilter::exact('parent_id'),
                AllowedFilter::exact('is_active'),
            )
            ->allowedSorts(
                'name',
                'sort_order',
                'created_at',
                AllowedSort::field('parent', 'parent_id'),
            )
            ->allowedIncludes(
                'parent',
                'children',
                'posts',
                'navigationItems',
            )
            ->defaultSort('sort_order', 'name');
    }

    /** @param Builder<PostCategory> $query */
    private static function searchFilter(Builder $query, mixed $value): void
    {
        if (! is_scalar($value)) {
            return;
        }

        $searchTerm = trim((string) $value);

        if ($searchTerm === '') {
            return;
        }

        NormalizedSearch::whereAnyLike($query, ['name', 'slug', 'description'], $searchTerm);
    }
}
