<?php

declare(strict_types=1);

namespace App\QueryBuilders;

use App\Models\NavigationMenu;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

final class CmsNavigationMenusQueryBuilder
{
    /** @return QueryBuilder<NavigationMenu> */
    public static function make(): QueryBuilder
    {
        return QueryBuilder::for(NavigationMenu::query())
            ->allowedFilters(
                AllowedFilter::callback('search', self::searchFilter(...)),
                AllowedFilter::exact('location'),
                AllowedFilter::exact('is_active'),
            )
            ->allowedSorts(
                'name',
                'location',
                'created_at',
            )
            ->allowedIncludes(
                'items',
            )
            ->defaultSort('name');
    }

    /** @param Builder<NavigationMenu> $query */
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
                ->where('name', 'like', "%{$searchTerm}%")
                ->orWhere('slug', 'like', "%{$searchTerm}%")
                ->orWhere('location', 'like', "%{$searchTerm}%");
        });
    }
}
