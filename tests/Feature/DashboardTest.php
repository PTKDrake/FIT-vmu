<?php

use App\Models\Media;
use App\Models\Post;
use App\Models\StaffProfile;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get('/cms')->assertRedirect('/login');
});

test('users without dashboard permission cannot visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get('/cms')->assertForbidden();
});

test('authorized users can visit the dashboard and receive shared permissions', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $user = User::factory()->create();
    $user->assignRole('staff');

    $this->actingAs($user);

    $this->get('/cms')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('cms/dashboard'));
});

test('dashboard shares the authenticated user permission list with inertia', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $user = User::factory()->create();
    $user->assignRole('editor');

    $this->actingAs($user);

    $this->get('/cms')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/dashboard')
            ->where('auth.permissions', $user->getAllPermissions()->pluck('name')->sort()->values()->all())
        );
});

test('dashboard overview shares operational summary data', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $user = User::factory()->create();
    $user->assignRole('staff');

    $media = Media::factory()->create([
        'uploaded_by' => $user->id,
    ]);

    Post::factory()->count(2)->create([
        'author_id' => $user->id,
        'thumbnail_id' => $media->id,
        'status' => 'published',
        'published_at' => now(),
    ]);

    Post::factory()->create([
        'author_id' => $user->id,
        'thumbnail_id' => $media->id,
        'status' => 'pending',
        'published_at' => null,
    ]);

    StaffProfile::factory()->create([
        'user_id' => $user->id,
        'is_public' => true,
    ]);

    $this->actingAs($user);

    $this->get('/cms')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/dashboard')
            ->where('overview.stats.0.value', 2)
            ->where('overview.stats.1.value', 1)
            ->where('overview.stats.2.value', 1)
            ->has('overview.recentActivity')
            ->has('overview.pendingReview', 1)
        );
});

test('legacy dashboard path redirects to cms root', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $user = User::factory()->create();
    $user->assignRole('staff');

    $this->actingAs($user);

    $this->get('/dashboard')->assertRedirect('/cms');
});

test('cms posts page is available for editors', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $user = User::factory()->create();
    $user->assignRole('editor');

    $this->actingAs($user);

    $this->get('/cms/posts')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('cms/posts/index'));
});
