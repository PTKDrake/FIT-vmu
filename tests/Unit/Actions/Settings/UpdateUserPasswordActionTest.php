<?php

declare(strict_types=1);

use App\Actions\Settings\UpdateUserPasswordAction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('it updates the user password', function (): void {
    $user = User::factory()->create();

    app(UpdateUserPasswordAction::class)($user, 'new-password');

    expect(Hash::check('new-password', $user->refresh()->password))->toBeTrue();
});
