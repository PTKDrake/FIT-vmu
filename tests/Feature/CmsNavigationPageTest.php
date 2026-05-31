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
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/navigation/index')
            ->has('editorStateKey')
            ->has('menus')
            ->has('resourceCatalog')
        );
});

test('cms navigation old detail route is not available anymore', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $user = User::factory()->create();
    $user->assignRole('editor');

    $this->actingAs($user);

    $this->get('/cms/navigation/1')
        ->assertMethodNotAllowed();
});
