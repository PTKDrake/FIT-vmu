<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ReservedPageSlug implements ValidationRule
{
    /**
     * @var list<string>
     */
    private const RESERVED_ROOT_SEGMENTS = ['auth', 'settings'];

    /**
     * @param  Closure(string, string|null=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) && ! is_numeric($value)) {
            return;
        }

        $slug = trim((string) $value);

        if ($slug === '') {
            return;
        }

        $normalizedSlug = trim($slug, '/');

        if ($normalizedSlug === '') {
            $fail('The '.$attribute.' field must be a valid page path.');

            return;
        }

        $rootSegment = strtolower(explode('/', $normalizedSlug, 2)[0]);

        if (in_array($rootSegment, self::RESERVED_ROOT_SEGMENTS, true)) {
            $fail('The '.$attribute.' field cannot use reserved auth or settings paths.');
        }
    }
}
