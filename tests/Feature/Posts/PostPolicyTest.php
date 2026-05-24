<?php

declare(strict_types=1);

use App\Models\Post;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Support\Facades\Gate;

test('editor can perform post policy abilities granted by permissions', function (): void {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $post = Post::factory()->create();

    expect(Gate::forUser($editor)->allows('viewAny', Post::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('view', $post))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('create', Post::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('update', $post))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('delete', $post))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('publish', $post))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('review', $post))->toBeTrue();
});

test('staff member cannot perform post policy abilities without post permissions', function (): void {
    $this->seed(RoleAndPermissionSeeder::class);

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $post = Post::factory()->create();

    expect(Gate::forUser($staff)->allows('viewAny', Post::class))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('view', $post))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('create', Post::class))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('update', $post))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('delete', $post))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('publish', $post))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('review', $post))->toBeFalse();
});
