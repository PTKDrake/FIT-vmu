<?php

declare(strict_types=1);

use App\Support\PuckComponentTypeNormalizer;

test('it normalizes legacy puck component aliases in nested props and zones', function () {
    $payload = [
        'root' => [
            'props' => [],
        ],
        'content' => [
            [
                'type' => 'HeroCustom',
                'props' => [
                    'children' => [
                        [
                            'type' => 'LatestPosts',
                            'props' => [
                                'title' => 'Tin mới',
                            ],
                        ],
                    ],
                ],
            ],
        ],
        'zones' => [
            'sidebar' => [
                [
                    'type' => 'AuthStatus',
                    'props' => [
                        'links' => [
                            [
                                'type' => 'LinkList',
                                'props' => [],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ];

    $normalized = PuckComponentTypeNormalizer::normalizeValue($payload);

    expect($normalized['content'][0]['type'])->toBe('FeaturedHero')
        ->and($normalized['content'][0]['props']['children'][0]['type'])->toBe('PostFeed')
        ->and($normalized['zones']['sidebar'][0]['type'])->toBe('AuthLinks')
        ->and($normalized['zones']['sidebar'][0]['props']['links'][0]['type'])->toBe('CustomLinkList');
});
