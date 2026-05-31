<?php

declare(strict_types=1);

namespace App\QueryBuilders;

use App\Models\Media;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

final class CmsMediaQueryBuilder
{
    /** @return QueryBuilder<Media> */
    public static function make(?Request $request = null): QueryBuilder
    {
        return QueryBuilder::for(Media::query(), $request)
            ->allowedFilters(
                AllowedFilter::callback('search', self::searchFilter(...)),
                AllowedFilter::exact('uploaded_by'),
                AllowedFilter::callback('kind', self::kindFilter(...)),
                AllowedFilter::callback('uploaded_at', self::uploadedAtFilter(...)),
            )
            ->allowedSorts(
                'display_name',
                'mime_type',
                'size',
                'created_at',
            )
            ->allowedIncludes('uploadedBy')
            ->defaultSort('-created_at');
    }

    /** @param Builder<Media> $query */
    private static function kindFilter(Builder $query, mixed $value): void
    {
        if (! is_scalar($value)) {
            return;
        }

        $kind = trim((string) $value);

        if (! in_array($kind, ['image', 'video', 'audio'], true)) {
            return;
        }

        $query->where('mime_type', 'like', "{$kind}/%");
    }

    /** @param Builder<Media> $query */
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
                ->where('display_name', 'like', "%{$searchTerm}%")
                ->orWhere('mime_type', 'like', "%{$searchTerm}%");
        });
    }

    /** @param Builder<Media> $query */
    private static function uploadedAtFilter(Builder $query, mixed $value): void
    {
        if (! is_scalar($value)) {
            return;
        }

        $preset = trim((string) $value);

        if ($preset === 'today') {
            $query->whereDate('created_at', today());

            return;
        }

        if ($preset === '7d') {
            $query->where('created_at', '>=', now()->subDays(7));

            return;
        }

        if ($preset === '30d') {
            $query->where('created_at', '>=', now()->subDays(30));

            return;
        }

        if ($preset === '365d') {
            $query->where('created_at', '>=', now()->subDays(365));
        }
    }
}
