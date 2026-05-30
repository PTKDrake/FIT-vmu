<?php

use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Broadcasting\BroadcastManager;

function cmsBroadcastChannelAuthorizer(string $channelName): Closure
{
    $broadcaster = app(BroadcastManager::class)->connection('null');
    $reflection = new ReflectionClass($broadcaster);
    $channelsProperty = $reflection->getProperty('channels');
    /** @var array<string, Closure> $channels */
    $channels = $channelsProperty->getValue($broadcaster);

    return $channels[$channelName];
}

test('cms posts broadcast channel authorizes editors and rejects viewers without post access', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $authorize = cmsBroadcastChannelAuthorizer('cms.posts');

    expect($authorize($editor))->toBeTrue()
        ->and($authorize($staff))->toBeFalse();
});

test('cms pages broadcast channel authorizes editors and rejects viewers without page access', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $authorize = cmsBroadcastChannelAuthorizer('cms.pages');

    expect($authorize($editor))->toBeTrue()
        ->and($authorize($staff))->toBeFalse();
});

test('cms units broadcast channel authorizes editors and rejects viewers without unit access', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $student = User::factory()->create();
    $student->assignRole('student');

    $authorize = cmsBroadcastChannelAuthorizer('cms.units');

    expect($authorize($editor))->toBeTrue()
        ->and($authorize($student))->toBeFalse();
});

test('cms staff profiles broadcast channel authorizes editors and rejects viewers without staff profile access', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $student = User::factory()->create();
    $student->assignRole('student');

    $authorize = cmsBroadcastChannelAuthorizer('cms.staff-profiles');

    expect($authorize($editor))->toBeTrue()
        ->and($authorize($student))->toBeFalse();
});
