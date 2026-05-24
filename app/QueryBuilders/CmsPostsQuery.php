<?php

declare(strict_types=1);

namespace App\QueryBuilders;

use App\Models\Post;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class CmsPostsQuery
{
    public static function make(?Request $request = null): QueryBuilder
    {
        return QueryBuilder::for(
            Post::query()->with(['author', 'thumbnail']),
            $request,
        )
            ->allowedFilters(
                AllowedFilter::callback('search', function (Builder $query, mixed $value): void {
                    $search = is_string($value) ? trim($value) : '';

                    if ($search === '') {
                        return;
                    }

                    $query->where(function (Builder $builder) use ($search): void {
                        $builder->where('title', 'like', "%{$search}%")
                            ->orWhere('slug', 'like', "%{$search}%")
                            ->orWhere('excerpt', 'like', "%{$search}%");
                    });
                }),
                AllowedFilter::exact('status'),
                AllowedFilter::exact('author', 'author_id'),
            )
            ->allowedSorts(
                'title',
                'status',
                AllowedSort::field('published_at'),
                AllowedSort::field('created_at'),
            )
            ->allowedIncludes(
                'author',
                'thumbnail',
            )
            ->defaultSort('-created_at');
    }
}
