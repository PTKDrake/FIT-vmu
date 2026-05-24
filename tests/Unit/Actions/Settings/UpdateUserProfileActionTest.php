<?php

declare(strict_types=1);

use App\Actions\Settings\UpdateUserProfileAction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('it updates the user profile and clears email verification when the email changes', function (): void {
    $user = User::factory()->create();

    app(UpdateUserProfileAction::class)($user, [
        'name' => 'Updated User',
        'email' => 'updated@example.com',
    ]);

    $user->refresh();

    expect($user->name)->toBe('Updated User')
        ->and($user->email)->toBe('updated@example.com')
        ->and($user->email_verified_at)->toBeNull();
});

test('it keeps the email verification timestamp when the email does not change', function (): void {
    $user = User::factory()->create();
    $verifiedAt = $user->email_verified_at;

    app(UpdateUserProfileAction::class)($user, [
        'name' => 'Updated User',
        'email' => $user->email,
    ]);

    expect($user->refresh()->email_verified_at?->equalTo($verifiedAt))->toBeTrue();
});
