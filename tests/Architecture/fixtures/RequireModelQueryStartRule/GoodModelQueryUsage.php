<?php

declare(strict_types=1);

namespace Tests\Architecture\fixtures\RequireModelQueryStartRule;

use App\Models\User;

final class GoodModelQueryUsage
{
    public function __invoke(): void
    {
        User::query()->where('email', 'jane@example.com')->first();
        User::query()->create(['name' => 'Jane']);
        User::factory()->createOne();
    }
}
