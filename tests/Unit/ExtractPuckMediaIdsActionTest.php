<?php

declare(strict_types=1);

use App\Actions\Puck\ExtractPuckMediaIdsAction;

test('extracts media ids from nested puck json payloads', function () {
    $payload = [
        'root' => ['props' => []],
        'content' => [
            [
                'type' => 'Section',
                'props' => [
                    'backgroundImage' => [
                        'mediaId' => 12,
                        'previewUrl' => '/storage/media/12.jpg',
                    ],
                    'children' => [
                        [
                            'type' => 'CarouselSection',
                            'props' => [
                                'items' => [
                                    [
                                        'imageUrl' => [
                                            'mediaId' => '34',
                                        ],
                                    ],
                                    [
                                        'imageUrl' => 'https://example.com/legacy.jpg',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
        'zones' => [
            'slot' => [
                [
                    'type' => 'Image',
                    'props' => [
                        'imageUrl' => [
                            'mediaId' => 56,
                        ],
                    ],
                ],
            ],
        ],
    ];

    $ids = app(ExtractPuckMediaIdsAction::class)([
        json_encode($payload, JSON_THROW_ON_ERROR),
        ['props' => ['avatar' => ['mediaId' => 12]]],
        'not-json',
    ]);

    expect($ids)->toBe([12, 34, 56]);
});
