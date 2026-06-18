<?php

declare(strict_types=1);

namespace App\QueryBuilders;

use App\Models\Page;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

final class CmsPagesQueryBuilder
{
    /** @return QueryBuilder<Page> */
    public static function make(): QueryBuilder
    {
        return QueryBuilder::for(Page::query())
            ->allowedFilters(
                AllowedFilter::callback('search', self::searchFilter(...)),
                AllowedFilter::exact('visibility'),
                AllowedFilter::exact('author_id'),
            )
            ->allowedSorts(
                'title',
                'visibility',
                'created_at',
                AllowedSort::field('author', 'author_id'),
            )
            ->allowedIncludes(
                'author',
                'thumbnail',
            )
            ->defaultSort('-created_at');
    }

    /** @param Builder<Page> $query */
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
                ->orWhere('excerpt', 'like', "%{$searchTerm}%")
                ->orWhere('seo_title', 'like', "%{$searchTerm}%")
                ->orWhere('seo_description', 'like', "%{$searchTerm}%");
        });
    }
}
