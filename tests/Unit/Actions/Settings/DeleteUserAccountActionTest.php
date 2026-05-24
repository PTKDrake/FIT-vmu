<?php

declare(strict_types=1);

use App\Actions\Settings\DeleteUserAccountAction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('it deletes the user account', function (): void {
    $user = User::factory()->create();

    app(DeleteUserAccountAction::class)($user);

    expect($user->fresh())->toBeNull();
});
