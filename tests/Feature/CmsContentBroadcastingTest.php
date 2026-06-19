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

test('cms content broadcast channel authorizes dashboard users and rejects non cms users', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $student = User::factory()->create();
    $student->assignRole('student');

    $authorize = cmsBroadcastChannelAuthorizer('cms.{resource}');

    foreach ([
        'layouts',
        'media',
        'navigation',
        'pages',
        'positions',
        'post-categories',
        'posts',
        'roles',
        'settings',
        'staff-profiles',
        'student-groups',
        'units',
        'users',
    ] as $resource) {
        expect($authorize($editor, $resource))->toBeTrue()
            ->and($authorize($student, $resource))->toBeFalse();
    }
});
