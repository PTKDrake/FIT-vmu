<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Stringable;

final class NormalizedSearch
{
    public static function normalize(string $value): string
    {
        return Str::of($value)
            ->ascii('vi')
            ->lower()
            ->squish()
            ->trim()
            ->toString();
    }

    /** @param iterable<mixed> $values */
    public static function fromValues(iterable $values): string
    {
        $text = [];

        foreach ($values as $value) {
            if ($value === null) {
                continue;
            }

            if (is_scalar($value) || $value instanceof Stringable) {
                $text[] = (string) $value;
            }
        }

        return self::normalize(implode(' ', $text));
    }

    /**
     * @template TModel of Model
     *
     * @param  Builder<TModel>  $query
     * @param  list<string>  $columns
     */
    public static function whereAnyLike(Builder $query, array $columns, string $searchTerm): void
    {
        $normalizedSearchTerm = self::normalize($searchTerm);

        if ($normalizedSearchTerm === '') {
            return;
        }

        $query->where('search_text', 'like', "%{$normalizedSearchTerm}%");
    }
}
