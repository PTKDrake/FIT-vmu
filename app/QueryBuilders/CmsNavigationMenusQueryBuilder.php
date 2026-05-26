<?php

declare(strict_types=1);

namespace App\QueryBuilders;

use App\Models\NavigationMenu;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

final class CmsNavigationMenusQueryBuilder
{
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
                ->orWhere('location', 'like', "%{$searchTerm}%");
        });
    }
}
