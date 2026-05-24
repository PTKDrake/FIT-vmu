<?php

declare(strict_types=1);

namespace App\QueryBuilders;

use App\Models\Document;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class CmsDocumentsQuery
{
    public static function make(?Request $request = null): QueryBuilder
    {
        return QueryBuilder::for(
            Document::query()->with(['owner', 'file', 'rows']),
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
                            ->orWhere('document_type', 'like', "%{$search}%");
                    });
                }),
                AllowedFilter::exact('status'),
                AllowedFilter::exact('visibility'),
                AllowedFilter::exact('document_type'),
                AllowedFilter::exact('document_mode'),
                AllowedFilter::exact('owner', 'owner_id'),
            )
            ->allowedSorts(
                'title',
                'status',
                'visibility',
                AllowedSort::field('published_at'),
                AllowedSort::field('created_at'),
            )
            ->allowedIncludes(
                'owner',
                'file',
                'rows',
            )
            ->defaultSort('-created_at');
    }
}
