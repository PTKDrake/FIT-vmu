<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Support\Str;
use InvalidArgumentException;

final class PuckSeedData
{
    /**
     * @param  array<string, mixed>|list<array<string, mixed>>|string|null  $data
     * @param  array<string, mixed>  $rootProps
     */
    public static function forPage(
        array|string|null $data,
        array $rootProps = [],
        string $defaultPrefix = 'puck-page',
    ): string {
        return self::encode(self::normalizePayload($data, $rootProps, $defaultPrefix));
    }

    /**
     * @param  array<string, mixed>|list<array<string, mixed>>|string|null  $data
     */
    public static function forSlot(array|string|null $data, string $defaultPrefix = 'puck-slot'): string
    {
        return self::forPage($data, [], $defaultPrefix);
    }

    /**
     * @param  array<string, mixed>|list<array<string, mixed>>|string|null  $data
     * @return array{
     *     header_data: string,
     *     left_data: string,
     *     right_data: string,
     *     footer_data: string,
     * }
     */
    public static function splitSiteLayout(array|string|null $data): array
    {
        $payload = self::normalizePayload($data, [], 'site-layout-frame');
        $frame = null;

        foreach ($payload['content'] as $block) {
            if (($block['type'] ?? null) !== 'SiteLayoutFrame') {
                continue;
            }

            $frame = $block;

            break;
        }

        $frameProps = is_array($frame['props'] ?? null) ? $frame['props'] : [];

        return [
            'header_data' => self::forSlot(self::slotData($frameProps['header'] ?? [])),
            'left_data' => self::forSlot(self::slotData($frameProps['left'] ?? [])),
            'right_data' => self::forSlot(self::slotData($frameProps['right'] ?? [])),
            'footer_data' => self::forSlot(self::slotData($frameProps['footer'] ?? [])),
        ];
    }

    /**
     * @param  array<string, mixed>|list<array<string, mixed>>|string|null  $data
     * @param  array<string, mixed>  $rootProps
     * @return array{
     *     root: array{props: array<string, mixed>},
     *     content: list<array<string, mixed>>,
     *     zones: array<string, list<array<string, mixed>>>,
     * }
     */
    private static function normalizePayload(
        array|string|null $data,
        array $rootProps,
        string $defaultPrefix,
    ): array {
        $decoded = self::decode($data);
        $content = self::extractContent($decoded);

        $normalized = [
            'root' => [
                'props' => array_replace(self::extractRootProps($decoded), $rootProps),
            ],
            'content' => self::assignBlockIds($content, $defaultPrefix),
            'zones' => self::normalizeZones($decoded['zones'] ?? []),
        ];

        return $normalized;
    }

    /**
     * @param  array<string, mixed>|list<array<string, mixed>>|string|null  $data
     * @return array<string, mixed>|list<array<string, mixed>>
     */
    private static function decode(array|string|null $data): array
    {
        if ($data === null || $data === '') {
            return [];
        }

        if (is_string($data)) {
            try {
                $decoded = json_decode($data, true, flags: JSON_THROW_ON_ERROR);
            } catch (\JsonException $exception) {
                throw new InvalidArgumentException('Invalid Puck seed JSON payload.', previous: $exception);
            }

            if (is_array($decoded) && self::isDecodedPayload($decoded)) {
                return $decoded;
            }

            throw new InvalidArgumentException('Invalid Puck seed JSON payload.');
        }

        return $data;
    }

    /**
     * @param  array<string, mixed>|list<array<string, mixed>>  $decoded
     * @return list<array<string, mixed>>
     */
    private static function extractContent(array $decoded): array
    {
        if (self::isBlockList($decoded)) {
            return $decoded;
        }

        if (! is_array($decoded['content'] ?? null)) {
            return [];
        }

        $content = $decoded['content'];

        return self::isBlockList($content) ? $content : [];
    }

    /**
     * @param  array<string, mixed>|list<array<string, mixed>>  $decoded
     * @return array<string, mixed>
     */
    private static function extractRootProps(array $decoded): array
    {
        if (! is_array($decoded['root'] ?? null)) {
            return [];
        }

        $root = $decoded['root'];

        if (! is_array($root['props'] ?? null)) {
            return [];
        }

        return self::keyedArray($root['props']);
    }

    /**
     * @return array<string, list<array<string, mixed>>>
     */
    private static function normalizeZones(mixed $zones): array
    {
        if (! is_array($zones)) {
            return [];
        }

        $normalizedZones = [];

        foreach ($zones as $zone => $value) {
            if (! is_string($zone) || ! is_array($value) || ! self::isBlockList($value)) {
                continue;
            }

            $normalizedZones[$zone] = self::assignBlockIds($value, "zone-{$zone}");
        }

        return $normalizedZones;
    }

    /**
     * @param  list<array<string, mixed>>  $blocks
     * @return list<array<string, mixed>>
     */
    private static function assignBlockIds(array $blocks, string $prefix): array
    {
        /** @var list<array<string, mixed>> $blocksWithIds */
        $blocksWithIds = array_map(
            fn (array $block, int $index): array => self::assignBlockIdsToNode($block, "{$prefix}-".($index + 1)),
            $blocks,
            array_keys($blocks),
        );

        return $blocksWithIds;
    }

    /**
     * @param  array<string, mixed>  $block
     * @return array<string, mixed>
     */
    private static function assignBlockIdsToNode(array $block, string $prefix): array
    {
        if (! is_string($block['type'] ?? null)) {
            return $block;
        }

        $props = is_array($block['props'] ?? null) ? $block['props'] : [];

        if (! isset($props['id']) || ! is_string($props['id']) || $props['id'] === '') {
            $props['id'] = "{$prefix}-".Str::slug($block['type']);
        }

        $block['id'] = $props['id'];

        foreach ($props as $key => $value) {
            if (! is_array($value) || ! self::isBlockList($value)) {
                continue;
            }

            $props[$key] = self::assignBlockIds($value, "{$props['id']}-{$key}");
        }

        $block['props'] = $props;

        return $block;
    }

    /**
     * @param  array<int|string, mixed>  $value
     *
     * @phpstan-assert-if-true list<array<string, mixed>> $value
     */
    private static function isBlockList(array $value): bool
    {
        if (! array_is_list($value)) {
            return false;
        }

        foreach ($value as $item) {
            if (! is_array($item) || ! is_string($item['type'] ?? null)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param  array<mixed, mixed>  $value
     *
     * @phpstan-assert-if-true array<string, mixed>|list<array<string, mixed>> $value
     */
    private static function isDecodedPayload(array $value): bool
    {
        if (array_is_list($value)) {
            return self::isBlockList($value);
        }

        foreach ($value as $key => $_) {
            if (! is_string($key)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return array<string, mixed>|list<array<string, mixed>>|string|null
     */
    private static function slotData(mixed $value): array|string|null
    {
        if (is_string($value) || $value === null) {
            return $value;
        }

        if (! is_array($value)) {
            return [];
        }

        if (self::isDecodedPayload($value)) {
            return $value;
        }

        return [];
    }

    /**
     * @param  array<mixed, mixed>  $value
     * @return array<string, mixed>
     */
    private static function keyedArray(array $value): array
    {
        $normalized = [];

        foreach ($value as $key => $item) {
            if (! is_string($key)) {
                continue;
            }

            $normalized[$key] = $item;
        }

        return $normalized;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private static function encode(array $payload): string
    {
        return json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    }
}
