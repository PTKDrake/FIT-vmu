<?php

declare(strict_types=1);

namespace App\QueryBuilders;

use App\Models\Document;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

final class CmsDocumentsQueryBuilder
{
    /** @return QueryBuilder<Document> */
    public static function make(): QueryBuilder
    {
        return QueryBuilder::for(Document::query())
            ->allowedFilters(
                AllowedFilter::callback('search', self::searchFilter(...)),
                AllowedFilter::exact('status'),
                AllowedFilter::exact('visibility'),
                AllowedFilter::exact('document_type'),
                AllowedFilter::exact('document_mode'),
                AllowedFilter::exact('owner_id'),
            )
            ->allowedSorts(
                'title',
                'status',
                'visibility',
                'document_type',
                'document_mode',
                'published_at',
                'created_at',
                AllowedSort::field('owner', 'owner_id'),
            )
            ->allowedIncludes(
                'file',
                'owner',
            )
            ->defaultSort('-created_at');
    }

    /** @param Builder<Document> $query */
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
                ->orWhere('slug', 'like', "%{$searchTerm}%");
        });
    }
}
