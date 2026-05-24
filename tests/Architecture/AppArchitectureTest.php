<?php

declare(strict_types=1);

test('app avoids debug calls', function (): void {
    expect(['dd', 'dump'])
        ->not()
        ->toBeUsedIn('App');
});

test('settings actions follow the action suffix convention', function (): void {
    expect('App\\Actions\\Settings')
        ->toHaveSuffix('Action');
});
