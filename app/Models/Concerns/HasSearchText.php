<?php

declare(strict_types=1);

namespace App\Models\Concerns;

use App\Support\NormalizedSearch;
use Illuminate\Database\Eloquent\Model;

trait HasSearchText
{
    protected static function bootHasSearchText(): void
    {
        static::saving(function (Model $model): void {
            /** @var self $model */
            $model->forceFill([
                'search_text' => NormalizedSearch::fromValues(
                    array_map(
                        fn (string $column): mixed => $model->getAttribute($column),
                        $model->searchableTextColumns(),
                    ),
                ),
            ]);
        });
    }

    /** @return list<string> */
    abstract protected function searchableTextColumns(): array;
}
