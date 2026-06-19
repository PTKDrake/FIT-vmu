<?php

use App\Models\StaffProfile;
use App\Models\User;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get('/settings/profile');

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/settings/profile');

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->email_verified_at)->toBeNull();
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'name' => 'Test User',
            'email' => $user->email,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/settings/profile');

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->delete('/settings/delete-account', [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertSessionHas('message', __('auth.deleted'))
        ->assertRedirect('/');

    $this->assertGuest();
    expect($user->fresh())->toBeNull();
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from('/settings/delete-account')
        ->delete('/settings/delete-account', [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect('/settings/delete-account');

    expect($user->fresh())->not->toBeNull();
});

test('profile and staff profile details can be updated', function () {
    $user = User::factory()->create();
    $staffProfile = StaffProfile::factory()->create([
        'user_id' => $user->id,
    ]);

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'name' => 'Test User',
            'email' => $user->email,
            'academic_title' => 'TS.',
            'full_name' => 'Nguyễn Văn A',
            'slug' => 'nguyen-van-a',
            'staff_email' => 'test-staff@example.com',
            'phone' => '0987654321',
            'bio' => '{"blocks": []}',
            'is_public' => true,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/settings/profile');

    $user->refresh();
    $staffProfile->refresh();

    expect($user->name)->toBe('Test User');
    expect($staffProfile->academic_title)->toBe('TS.')
        ->and($staffProfile->full_name)->toBe('Nguyễn Văn A')
        ->and($staffProfile->slug)->toBe('nguyen-van-a')
        ->and($staffProfile->email)->toBe('test-staff@example.com')
        ->and($staffProfile->phone)->toBe('0987654321')
        ->and($staffProfile->bio)->toBe('{"blocks": []}')
        ->and($staffProfile->is_public)->toBeTrue();
});
