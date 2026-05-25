<?php

declare(strict_types=1);

namespace App\Http\Requests;

final class DocumentRequestOptions
{
    /**
     * @return list<string>
     */
    public static function storageFormats(): array
    {
        return ['blocknote_json'];
    }

    /**
     * @return list<string>
     */
    public static function documentTypes(): array
    {
        return [
            'lecture',
            'exercise',
            'exam',
            'form',
            'score',
            'announcement',
            'other',
        ];
    }

    /**
     * @return list<string>
     */
    public static function visibilities(): array
    {
        return [
            'public',
            'login_required',
            'students',
            'staff',
            'private',
            'student_code',
        ];
    }

    /**
     * @return list<string>
     */
    public static function modes(): array
    {
        return [
            'file',
            'preview',
            'student_table',
        ];
    }
}
