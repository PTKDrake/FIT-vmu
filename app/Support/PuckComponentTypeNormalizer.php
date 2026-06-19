<?php

declare(strict_types=1);

namespace App\Support;

use JsonException;

final class PuckComponentTypeNormalizer
{
    /**
     * @var array<string, string>
     */
    private const COMPONENT_TYPE_ALIASES = [
        'HeroCustom' => 'FeaturedHero',
        'StatsCustom' => 'HighlightStats',
        'ProgramsCustom' => 'ProgramGrid',
        'AboutCustom' => 'AboutFeature',
        'NewsCustom' => 'FeaturedNews',
        'AnnouncementsCustom' => 'FeaturedAnnouncements',
        'CtaCustom' => 'EnrollmentCta',
        'FitNavigationHeader' => 'SiteHeader',
        'FitFooter' => 'SiteFooter',
        'PostHeader' => 'PostDetailHeader',
        'LatestPosts' => 'PostFeed',
        'LatestAnnouncements' => 'AnnouncementFeed',
        'RelatedPosts' => 'RelatedPostFeed',
        'Categories' => 'PostCategoryList',
        'PageLinks' => 'PageLinkList',
        'LinkList' => 'CustomLinkList',
        'AuthStatus' => 'AuthLinks',
    ];

    public static function normalizeType(string $type): string
    {
        return self::COMPONENT_TYPE_ALIASES[$type] ?? $type;
    }

    public static function normalizeJson(?string $payload): ?string
    {
        if ($payload === null || $payload === '') {
            return $payload;
        }

        try {
            $decoded = json_decode($payload, true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            return $payload;
        }

        $normalized = self::normalizeValue($decoded);

        try {
            return json_encode($normalized, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        } catch (JsonException) {
            return $payload;
        }
    }

    public static function normalizeValue(mixed $value): mixed
    {
        if (! is_array($value)) {
            return $value;
        }

        if (self::isComponent($value)) {
            /** @var array<string, mixed> $value */
            return self::normalizeComponent($value);
        }

        if (self::isBlockList($value)) {
            $normalizedComponents = [];

            foreach ($value as $component) {
                /** @var array<string, mixed> $component */
                $normalizedComponents[] = self::normalizeComponent($component);
            }

            return $normalizedComponents;
        }

        $normalized = [];

        foreach ($value as $key => $item) {
            $normalized[$key] = self::normalizeValue($item);
        }

        return $normalized;
    }

    /**
     * @param  array<string, mixed>  $component
     * @return array<string, mixed>
     */
    private static function normalizeComponent(array $component): array
    {
        if (! is_string($component['type'] ?? null)) {
            return $component;
        }

        $component['type'] = self::normalizeType($component['type']);

        if (! is_array($component['props'] ?? null)) {
            return $component;
        }

        $normalizedProps = [];

        foreach ($component['props'] as $key => $value) {
            $normalizedProps[$key] = self::normalizeValue($value);
        }

        $component['props'] = $normalizedProps;

        return $component;
    }

    /**
     * @param  array<int|string, mixed>  $value
     */
    private static function isComponent(array $value): bool
    {
        return isset($value['type']) && is_string($value['type']);
    }

    /**
     * @param  array<int|string, mixed>  $value
     */
    private static function isBlockList(array $value): bool
    {
        if (! array_is_list($value)) {
            return false;
        }

        foreach ($value as $item) {
            if (! is_array($item) || ! isset($item['type']) || ! is_string($item['type'])) {
                return false;
            }
        }

        return true;
    }
}
