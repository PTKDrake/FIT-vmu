<?php

declare(strict_types=1);

namespace Tests\Architecture\fixtures\RequireModelQueryStartRule;

use App\Models\User;

final class BadModelQueryUsage
{
    public function __invoke(): void
    {
        User::find(1);
        User::where('email', 'jane@example.com');
        User::firstOrFail();
        User::all();
        User::destroy(1);
        User::create(['name' => 'Jane']);
        User::firstOrCreate(['email' => 'jane@example.com']);
    }
}
