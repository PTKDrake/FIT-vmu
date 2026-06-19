<?php

declare(strict_types=1);

use App\Actions\Settings\UpdateUserProfileAction;
use App\Models\StaffProfile;
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

test('it updates the user and staff profile', function (): void {
    $user = User::factory()->create();
    $staffProfile = StaffProfile::factory()->create([
        'user_id' => $user->id,
    ]);

    app(UpdateUserProfileAction::class)($user, [
        'name' => 'Updated User',
        'email' => $user->email,
        'academic_title' => 'ThS.',
        'full_name' => 'Nguyễn Văn B',
        'slug' => 'nguyen-van-b',
        'staff_email' => 'staff-updated@example.com',
        'phone' => '0123456789',
        'bio' => 'Bio content',
        'is_public' => false,
    ]);

    $user->refresh();
    $staffProfile->refresh();

    expect($user->name)->toBe('Updated User')
        ->and($staffProfile->academic_title)->toBe('ThS.')
        ->and($staffProfile->full_name)->toBe('Nguyễn Văn B')
        ->and($staffProfile->slug)->toBe('nguyen-van-b')
        ->and($staffProfile->email)->toBe('staff-updated@example.com')
        ->and($staffProfile->phone)->toBe('0123456789')
        ->and($staffProfile->bio)->toBe('Bio content')
        ->and($staffProfile->is_public)->toBeFalse();
});
