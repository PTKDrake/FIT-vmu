<?php

declare(strict_types=1);

namespace App\QueryBuilders;

use App\Models\Position;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

final class CmsPositionsQueryBuilder
{
    /** @return QueryBuilder<Position> */
    public static function make(Request $request): QueryBuilder
    {
        return QueryBuilder::for(Position::query(), $request)
            ->allowedFilters(
                AllowedFilter::callback('search', self::searchFilter(...)),
                AllowedFilter::exact('is_active'),
            )
            ->allowedSorts(
                'name',
                'sort_order',
                'created_at',
            )
            ->defaultSort('sort_order', 'name');
    }

    /** @param Builder<Position> $query */
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
                ->orWhere('slug', 'like', "%{$searchTerm}%");
        });
    }
}
