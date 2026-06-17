<?php

declare(strict_types=1);

namespace App\Actions\Puck;

class ExtractPuckMediaIdsAction
{
    /**
     * @param  iterable<mixed>  $payloads
     * @return list<int>
     */
    public function __invoke(iterable $payloads): array
    {
        $mediaIds = [];

        foreach ($payloads as $payload) {
            $this->extractFromValue($this->decodePayload($payload), $mediaIds);
        }

        sort($mediaIds);

        return array_values(array_unique($mediaIds));
    }

    /**
     * @param  array<int, int>  $mediaIds
     */
    private function extractFromValue(mixed $value, array &$mediaIds): void
    {
        if (! is_array($value)) {
            return;
        }

        $mediaId = $value['mediaId'] ?? null;

        if (is_int($mediaId) || (is_string($mediaId) && ctype_digit($mediaId))) {
            $mediaIds[] = (int) $mediaId;
        }

        foreach ($value as $child) {
            $this->extractFromValue($child, $mediaIds);
        }
    }

    private function decodePayload(mixed $payload): mixed
    {
        if (! is_string($payload)) {
            return $payload;
        }

        if (trim($payload) === '') {
            return null;
        }

        try {
            return json_decode($payload, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return null;
        }
    }
}
