<?php

declare(strict_types=1);

namespace App\Data;

use Carbon\CarbonInterface;
use DateTimeInterface;
use Illuminate\Support\Carbon;
use Spatie\LaravelData\Data as BaseData;

abstract class Data extends BaseData
{
    /**
     * @return array<string, mixed>|null
     */
    protected static function normalizeArray(mixed $value): ?array
    {
        if (! is_array($value)) {
            return null;
        }

        /** @var array<string, mixed> $normalized */
        $normalized = $value;

        return $normalized;
    }

    protected static function normalizeDateTime(mixed $value): ?CarbonInterface
    {
        if ($value === null) {
            return null;
        }

        if ($value instanceof CarbonInterface) {
            return $value;
        }

        if ($value instanceof DateTimeInterface) {
            return Carbon::instance($value);
        }

        if (is_string($value) && $value !== '') {
            return Carbon::parse($value);
        }

        return null;
    }
}
