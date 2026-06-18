<?php

declare(strict_types=1);

namespace App\Support;

class ContentVisibilityOptions
{
    /** @return list<string> */
    public static function visibilities(): array
    {
        return [
            'public',
            'authenticated',
            'students',
            'student_groups',
        ];
    }

    /** @return list<string> */
    public static function pageVisibilities(): array
    {
        return [
            ...self::visibilities(),
            'hidden',
        ];
    }
}
