<?php

use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertSessionHas('message', __('auth.welcome_back'));
    $response->assertRedirect(route('home', absolute: false));
});

test('users with dashboard permission are redirected to dashboard after login', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $user = User::factory()->create();
    $user->assignRole('staff');

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect(route('cms.dashboard', absolute: false));
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertSessionHasErrors([
        'email' => __('auth.failed'),
    ]);
    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});

test('authenticated users are redirected away from guest auth pages', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/login')
        ->assertRedirect(route('home', absolute: false));

    $this->actingAs($user)
        ->get('/register')
        ->assertRedirect(route('home', absolute: false));
});

test('authenticated dashboard users are redirected to cms when visiting guest auth pages', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $user = User::factory()->create();
    $user->assignRole('staff');

    $this->actingAs($user)
        ->get('/login')
        ->assertRedirect(route('cms.dashboard', absolute: false));
});
