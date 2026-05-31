<?php

declare(strict_types=1);

namespace App\QueryBuilders;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

final class CmsUsersQueryBuilder
{
    /** @return QueryBuilder<User> */
    public static function make(?Request $request = null): QueryBuilder
    {
        return QueryBuilder::for(User::query(), $request)
            ->allowedFilters(
                AllowedFilter::callback('search', self::searchFilter(...)),
                AllowedFilter::callback('verified', self::verifiedFilter(...)),
                AllowedFilter::callback('role', self::roleFilter(...)),
            )
            ->allowedSorts(
                'name',
                'email',
                'created_at',
                'email_verified_at',
            );
    }

    private static function searchFilter(Builder $query, mixed $value): void
    {
        if (! is_string($value) || trim($value) === '') {
            return;
        }

        $search = trim($value);

        $query->where(function (Builder $builder) use ($search): void {
            $builder
                ->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        });
    }

    private static function verifiedFilter(Builder $query, mixed $value): void
    {
        if ($value === '1' || $value === 1 || $value === true) {
            $query->whereNotNull('email_verified_at');

            return;
        }

        if ($value === '0' || $value === 0 || $value === false) {
            $query->whereNull('email_verified_at');
        }
    }

    private static function roleFilter(Builder $query, mixed $value): void
    {
        if (! is_string($value) || trim($value) === '') {
            return;
        }

        $role = trim($value);

        $query->whereHas('roles', function (Builder $builder) use ($role): void {
            $builder->where('name', $role);
        });
    }
}
