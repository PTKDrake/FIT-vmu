<?php

declare(strict_types=1);

test('public pages render default social preview metadata', function () {
    $response = $this->get('/');

    $response
        ->assertOk()
        ->assertSee('<meta data-inertia="description" name="description"', false)
        ->assertSee('property="og:image" content="'.asset('logo.png').'"', false)
        ->assertSee('property="og:image:secure_url" content="'.asset('logo.png').'"', false)
        ->assertSee('property="og:image:type" content="image/png"', false)
        ->assertSee('property="og:image:width" content="300"', false)
        ->assertSee('property="og:image:height" content="300"', false)
        ->assertSee('name="twitter:card" content="summary"', false)
        ->assertSee('name="twitter:image" content="'.asset('logo.png').'"', false);
});
