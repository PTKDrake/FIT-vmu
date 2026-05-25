<?php

use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

beforeEach(function () {
    config()->set('services.google.client_id', 'google-client-id');
    config()->set('services.google.client_secret', 'google-client-secret');
    config()->set('services.google.redirect', '/auth/google/callback');
});

test('google redirect endpoint sends guests to google when configured', function () {
    $provider = Mockery::mock();
    $provider->shouldReceive('scopes')->once()->with(['openid', 'profile', 'email'])->andReturnSelf();
    $provider->shouldReceive('redirect')->once()->andReturn(redirect('https://accounts.google.com/o/oauth2/auth'));

    Socialite::shouldReceive('driver')->once()->with('google')->andReturn($provider);

    $response = $this->get(route('auth.google.redirect'));

    $response->assertRedirect('https://accounts.google.com/o/oauth2/auth');
});

test('google callback creates a new user and redirects to home for non cms accounts', function () {
    $provider = Mockery::mock();
    $provider->shouldReceive('user')->once()->andReturn(
        (new SocialiteUser)->map([
            'id' => 'google-user-001',
            'name' => 'Google User',
            'email' => 'google-user@example.com',
            'avatar' => 'https://example.com/avatar.png',
        ])->setRaw([
            'sub' => 'google-user-001',
            'email' => 'google-user@example.com',
        ]),
    );

    Socialite::shouldReceive('driver')->once()->with('google')->andReturn($provider);

    $response = $this->get(route('auth.google.callback', ['code' => 'oauth-code']));

    $this->assertAuthenticated();
    $response->assertRedirect(route('home', absolute: false));

    expect(auth()->user())->not->toBeNull()
        ->and(auth()->user()?->email)->toBe('google-user@example.com')
        ->and(auth()->user()?->name)->toBe('Google User');
});

test('google callback authenticates existing cms users and redirects to dashboard', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $user = User::factory()->create([
        'name' => 'Existing Staff',
        'email' => 'staff-google@example.com',
    ]);
    $user->assignRole('staff');

    $provider = Mockery::mock();
    $provider->shouldReceive('user')->once()->andReturn(
        (new SocialiteUser)->map([
            'id' => 'google-user-002',
            'name' => 'Existing Staff',
            'email' => 'staff-google@example.com',
            'avatar' => 'https://example.com/avatar.png',
        ])->setRaw([
            'sub' => 'google-user-002',
            'email' => 'staff-google@example.com',
        ]),
    );

    Socialite::shouldReceive('driver')->once()->with('google')->andReturn($provider);

    $response = $this->get(route('auth.google.callback', ['code' => 'oauth-code']));

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    expect(auth()->id())->toBe($user->id);
});

test('google redirect endpoint falls back to login when google is not configured', function () {
    config()->set('services.google.client_id', null);
    config()->set('services.google.client_secret', null);
    config()->set('services.google.redirect', null);

    $response = $this->get(route('auth.google.redirect'));

    $response->assertRedirect(route('login'));
});
