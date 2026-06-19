<?php

declare(strict_types=1);

namespace App\QueryBuilders;

use App\Models\NavigationItem;
use App\Support\NormalizedSearch;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

final class CmsNavigationItemsQueryBuilder
{
    /** @return QueryBuilder<NavigationItem> */
    public static function make(): QueryBuilder
    {
        return QueryBuilder::for(NavigationItem::query())
            ->allowedFilters(
                AllowedFilter::callback('search', self::searchFilter(...)),
                AllowedFilter::exact('menu_id'),
                AllowedFilter::exact('parent_id'),
                AllowedFilter::exact('type'),
                AllowedFilter::exact('is_active'),
                AllowedFilter::exact('linkable_type'),
            )
            ->allowedSorts(
                'title',
                'type',
                'sort_order',
                'created_at',
            )
            ->allowedIncludes(
                'menu',
                'parent',
                'children',
                'linkable',
            )
            ->defaultSort('sort_order', 'title');
    }

    /** @param Builder<NavigationItem> $query */
    private static function searchFilter(Builder $query, mixed $value): void
    {
        if (! is_scalar($value)) {
            return;
        }

        $searchTerm = trim((string) $value);

        if ($searchTerm === '') {
            return;
        }

        NormalizedSearch::whereAnyLike($query, ['title', 'url'], $searchTerm);
    }
}
