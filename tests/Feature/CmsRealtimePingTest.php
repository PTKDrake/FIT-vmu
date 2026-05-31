<?php

use App\Events\CmsRealtimePinged;
use App\Models\User;
use Illuminate\Broadcasting\BroadcastManager;
use Illuminate\Support\Facades\Event;
use Spatie\Permission\Models\Permission;

function grantDashboardPermission(User $user): void
{
    Permission::findOrCreate('view admin dashboard', 'web');
    $user->givePermissionTo('view admin dashboard');
}

function cmsRealtimeChannelAuthorizer(): Closure
{
    $broadcaster = app(BroadcastManager::class)->connection('null');
    $reflection = new ReflectionClass($broadcaster);
    $channelsProperty = $reflection->getProperty('channels');
    /** @var array<string, Closure> $channels */
    $channels = $channelsProperty->getValue($broadcaster);

    return $channels['cms-user.{userId}'];
}

test('cms realtime ping route requires authentication', function () {
    $this->post('/cms/realtime/ping')->assertRedirect('/login');
});

test('users without dashboard permission cannot send a cms realtime ping', function () {
    Event::fake([CmsRealtimePinged::class]);

    $this->actingAs(User::factory()->create())
        ->post('/cms/realtime/ping')
        ->assertForbidden();

    Event::assertNotDispatched(CmsRealtimePinged::class);
});

test('authorized cms users can send a realtime ping', function () {
    Event::fake([CmsRealtimePinged::class]);

    $user = User::factory()->create();
    grantDashboardPermission($user);

    $this->actingAs($user)
        ->post('/cms/realtime/ping')
        ->assertAccepted()
        ->assertJsonPath('status', 'queued')
        ->assertJsonPath('user_id', $user->id);

    Event::assertDispatched(CmsRealtimePinged::class, function (CmsRealtimePinged $event) use ($user): bool {
        return $event->userId === $user->id
            && $event->broadcastWith()['user_id'] === $user->id
            && filled($event->broadcastWith()['message'])
            && filled($event->broadcastWith()['sent_at']);
    });
});

test('cms realtime channel authorizes only the matching user with dashboard permission', function () {
    $user = User::factory()->create();
    grantDashboardPermission($user);

    $authorize = cmsRealtimeChannelAuthorizer();

    expect($authorize($user, $user->id))->toBeTrue();
});

test('cms realtime channel denies an authenticated user subscribing to another user channel', function () {
    $authorizedUser = User::factory()->create();
    grantDashboardPermission($authorizedUser);

    $otherUser = User::factory()->create();

    $authorize = cmsRealtimeChannelAuthorizer();

    expect($authorize($authorizedUser, $otherUser->id))->toBeFalse();
});

test('cms realtime channel denies authenticated users without dashboard permission', function () {
    $user = User::factory()->create();

    $authorize = cmsRealtimeChannelAuthorizer();

    expect($authorize($user, $user->id))->toBeFalse();
});
