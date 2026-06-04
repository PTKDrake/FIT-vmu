<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    public const string KEY_HOMEPAGE_PAGE = 'homepage_page';

    public const string KEY_NOT_FOUND_PAGE = 'not_found_page';

    public const string KEY_STUDENT_HOME_PAGE = 'student_home_page';

    public const string KEY_DEFAULT_PAGE_LAYOUT = 'default_page_layout';

    public const string KEY_DEFAULT_CATEGORY_LAYOUT = 'default_category_layout';

    public const string KEY_DEFAULT_POST_LAYOUT = 'default_post_layout';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'key',
        'value',
    ];

    public static function get(string $key, mixed $default = null): mixed
    {
        $row = self::query()->where('key', $key)->first();

        return $row !== null ? ($row->value ?? $default) : $default;
    }

    public static function set(string $key, mixed $value): void
    {
        $stringValue = self::stringValue($value);

        self::query()->updateOrCreate(
            ['key' => $key],
            ['value' => $stringValue],
        );
    }

    public static function getInt(string $key): ?int
    {
        $value = self::get($key);

        if (is_int($value)) {
            return $value;
        }

        if (is_string($value) && $value !== '' && is_numeric($value)) {
            return (int) $value;
        }

        return null;
    }

    public static function homepagePageId(): ?int
    {
        return self::getInt(self::KEY_HOMEPAGE_PAGE);
    }

    public static function notFoundPageId(): ?int
    {
        return self::getInt(self::KEY_NOT_FOUND_PAGE);
    }

    public static function studentHomePageId(): ?int
    {
        return self::getInt(self::KEY_STUDENT_HOME_PAGE);
    }

    public static function defaultPageLayoutId(): ?int
    {
        return self::getInt(self::KEY_DEFAULT_PAGE_LAYOUT);
    }

    public static function defaultCategoryLayoutId(): ?int
    {
        return self::getInt(self::KEY_DEFAULT_CATEGORY_LAYOUT);
    }

    public static function defaultPostLayoutId(): ?int
    {
        return self::getInt(self::KEY_DEFAULT_POST_LAYOUT);
    }

    public static function layoutKeyForType(string $type): ?string
    {
        return match ($type) {
            'page' => self::KEY_DEFAULT_PAGE_LAYOUT,
            'category' => self::KEY_DEFAULT_CATEGORY_LAYOUT,
            'post' => self::KEY_DEFAULT_POST_LAYOUT,
            default => null,
        };
    }

    public static function defaultLayoutIdForType(string $type): ?int
    {
        $key = self::layoutKeyForType($type);

        return $key !== null ? self::getInt($key) : null;
    }

    public static function isDefaultForAnyType(SiteLayout $layout): bool
    {
        $id = self::stringValue($layout->getKey());

        if ($id === null) {
            return false;
        }

        return self::query()
            ->whereIn('key', [
                self::KEY_DEFAULT_PAGE_LAYOUT,
                self::KEY_DEFAULT_CATEGORY_LAYOUT,
                self::KEY_DEFAULT_POST_LAYOUT,
            ])
            ->where('value', $id)
            ->exists();
    }

    private static function stringValue(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        if (is_string($value)) {
            return $value;
        }

        if (is_int($value) || is_float($value) || is_bool($value)) {
            return (string) $value;
        }

        return null;
    }
}
