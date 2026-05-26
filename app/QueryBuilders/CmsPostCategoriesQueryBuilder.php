<?php

declare(strict_types=1);

namespace App\QueryBuilders;

use App\Models\PostCategory;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

final class CmsPostCategoriesQueryBuilder
{
    public static function make(): QueryBuilder
    {
        return QueryBuilder::for(PostCategory::query())
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

    private static function searchFilter(Builder $query, mixed $value): void
    {
        $searchTerm = trim((string) $value);

        if ($searchTerm === '') {
            return;
        }

        $query->where(function (Builder $query) use ($searchTerm): void {
            $query
                ->where('name', 'like', "%{$searchTerm}%")
                ->orWhere('slug', 'like', "%{$searchTerm}%")
                ->orWhere('description', 'like', "%{$searchTerm}%");
        });
    }
}
