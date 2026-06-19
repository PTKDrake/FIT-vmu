<?php

declare(strict_types=1);

namespace App\QueryBuilders;

use App\Models\StaffProfile;
use App\Support\NormalizedSearch;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

final class CmsStaffProfilesQueryBuilder
{
    /** @return QueryBuilder<StaffProfile> */
    public static function make(?Request $request = null): QueryBuilder
    {
        return QueryBuilder::for(StaffProfile::query(), $request)
            ->allowedFilters(
                AllowedFilter::callback('search', self::searchFilter(...)),
                AllowedFilter::exact('is_public'),
                AllowedFilter::exact('user_id'),
            )
            ->allowedSorts(
                'full_name',
                'created_at',
            )
            ->allowedIncludes(
                'user',
                'avatar',
                'appointments',
                'appointments.unit',
                'appointments.position',
            )
            ->defaultSort('-created_at');
    }

    /** @param Builder<StaffProfile> $query */
    private static function searchFilter(Builder $query, mixed $value): void
    {
        if (! is_scalar($value)) {
            return;
        }

        $searchTerm = trim((string) $value);

        if ($searchTerm === '') {
            return;
        }

        NormalizedSearch::whereAnyLike($query, ['full_name', 'slug', 'email', 'phone', 'bio'], $searchTerm);
    }
}
