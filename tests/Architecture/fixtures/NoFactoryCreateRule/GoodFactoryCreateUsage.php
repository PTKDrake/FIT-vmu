<?php

declare(strict_types=1);

use App\Models\User;

$user = User::factory()->createOne();

if ($user !== null) {
    User::factory()->count(2)->createMany();
}
