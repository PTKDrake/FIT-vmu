<?php

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\EditorUserSeeder;
use Illuminate\Support\Facades\Hash;

test('editor user seeder creates two editor accounts with the configured admin seed password', function () {
    config()->set('services.admin_seed_password', 'SeededPassword#2026');

    $this->seed(EditorUserSeeder::class);

    $editors = User::query()
        ->whereIn('email', ['editor-1@vimaru.edu.vn', 'editor-2@vimaru.edu.vn'])
        ->orderBy('email')
        ->get();

    expect($editors)->toHaveCount(2);

    expect($editors->pluck('name')->all())->toBe([
        'Biên tập viên 1',
        'Biên tập viên 2',
    ]);

    $editors->each(function (User $editor): void {
        expect($editor->hasRole('editor'))->toBeTrue()
            ->and($editor->email_verified_at)->not->toBeNull()
            ->and(Hash::check('SeededPassword#2026', $editor->password))->toBeTrue();
    });
});

test('editor user seeder is idempotent and updates the editor passwords', function () {
    config()->set('services.admin_seed_password', 'SeededPassword#2026');

    $this->seed(EditorUserSeeder::class);

    config()->set('services.admin_seed_password', 'UpdatedSeedPassword#2026');

    $this->seed(EditorUserSeeder::class);

    $editors = User::query()
        ->whereIn('email', ['editor-1@vimaru.edu.vn', 'editor-2@vimaru.edu.vn'])
        ->get();

    expect($editors)->toHaveCount(2);

    $editors->each(function (User $editor): void {
        expect(Hash::check('UpdatedSeedPassword#2026', $editor->password))->toBeTrue();
    });
});

test('editor user seeder skips creation when password is missing', function () {
    config()->set('services.admin_seed_password', null);

    $this->seed(EditorUserSeeder::class);

    expect(User::query()->whereIn('email', ['editor-1@vimaru.edu.vn', 'editor-2@vimaru.edu.vn'])->exists())->toBeFalse();
});

test('database seeder includes the seeded editor accounts without duplicate emails', function () {
    config()->set('services.admin_seed_password', 'SeededPassword#2026');

    $this->seed(DatabaseSeeder::class);
    $this->seed(DatabaseSeeder::class);

    expect(User::query()->where('email', 'editor-1@vimaru.edu.vn')->count())->toBe(1)
        ->and(User::query()->where('email', 'editor-2@vimaru.edu.vn')->count())->toBe(1);
});
