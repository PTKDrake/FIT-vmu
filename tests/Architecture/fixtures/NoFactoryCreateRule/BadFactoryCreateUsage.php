<?php

declare(strict_types=1);

use App\Models\User;

$user = User::factory()->create();

if ($user !== null) {
    User::factory()->state(['email_verified_at' => now()])->create();
}
