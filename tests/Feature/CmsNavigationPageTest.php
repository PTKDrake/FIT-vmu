<?php

use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('cms navigation list page is available for editors', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $user = User::factory()->create();
    $user->assignRole('editor');

    $this->actingAs($user);

    $this->get('/cms/navigation')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('cms/navigation/index'));
});

test('cms navigation detail page is available for editors', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $user = User::factory()->create();
    $user->assignRole('editor');

    $this->actingAs($user);

    $this->get('/cms/navigation/1')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/navigation/show')
            ->where('navigationMenuId', 1)
        );
});
