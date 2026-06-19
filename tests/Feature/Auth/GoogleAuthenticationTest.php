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
    $provider->shouldReceive('with')->once()->with([
        'hd' => 'st.vimaru.edu.vn',
        'prompt' => 'select_account',
    ])->andReturnSelf();
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
            'email' => 'google-user@st.vimaru.edu.vn',
            'avatar' => 'https://example.com/avatar.png',
        ])->setRaw([
            'sub' => 'google-user-001',
            'email' => 'google-user@st.vimaru.edu.vn',
        ]),
    );

    Socialite::shouldReceive('driver')->once()->with('google')->andReturn($provider);

    $response = $this->get(route('auth.google.callback', ['code' => 'oauth-code']));

    $this->assertAuthenticated();
    $response->assertRedirect(route('home', absolute: false));

    expect(auth()->user())->not->toBeNull()
        ->and(auth()->user()?->email)->toBe('google-user@st.vimaru.edu.vn')
        ->and(auth()->user()?->name)->toBe('Google User');
});

test('google callback authenticates existing cms users and redirects to dashboard', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $user = User::factory()->create([
        'name' => 'Existing Staff',
        'email' => 'staff-google@st.vimaru.edu.vn',
    ]);
    $user->assignRole('staff');

    $provider = Mockery::mock();
    $provider->shouldReceive('user')->once()->andReturn(
        (new SocialiteUser)->map([
            'id' => 'google-user-002',
            'name' => 'Existing Staff',
            'email' => 'staff-google@st.vimaru.edu.vn',
            'avatar' => 'https://example.com/avatar.png',
        ])->setRaw([
            'sub' => 'google-user-002',
            'email' => 'staff-google@st.vimaru.edu.vn',
        ]),
    );

    Socialite::shouldReceive('driver')->once()->with('google')->andReturn($provider);

    $response = $this->get(route('auth.google.callback', ['code' => 'oauth-code']));

    $this->assertAuthenticated();
    $response->assertRedirect(route('cms.dashboard', absolute: false));

    expect(auth()->id())->toBe($user->id);
});

test('google callback rejects users outside the allowed hosted domain', function () {
    $provider = Mockery::mock();
    $provider->shouldReceive('user')->once()->andReturn(
        (new SocialiteUser)->map([
            'id' => 'google-user-003',
            'name' => 'External User',
            'email' => 'external@example.com',
            'avatar' => 'https://example.com/avatar.png',
        ])->setRaw([
            'sub' => 'google-user-003',
            'email' => 'external@example.com',
        ]),
    );

    Socialite::shouldReceive('driver')->once()->with('google')->andReturn($provider);

    $response = $this->get(route('auth.google.callback', ['code' => 'oauth-code']));

    $this->assertGuest();
    $response
        ->assertRedirect(route('login'))
        ->assertSessionHas('message', __('auth.google_invalid_domain', ['domain' => 'st.vimaru.edu.vn']))
        ->assertSessionHas('type', 'error');

    $this->assertDatabaseMissing('users', [
        'email' => 'external@example.com',
    ]);
});

test('google redirect endpoint falls back to login when google is not configured', function () {
    config()->set('services.google.client_id', null);
    config()->set('services.google.client_secret', null);
    config()->set('services.google.redirect', null);

    $response = $this->get(route('auth.google.redirect'));

    $response->assertRedirect(route('login'));
});
