<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Route;

Route::get('/', Controllers\HomeController::class)->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('dashboard', 'cms');

    Route::prefix('cms')->name('cms.')->group(function () {
        Route::get('/', Controllers\DashboardController::class)
            ->can('view admin dashboard')
            ->name('dashboard');

        Route::get('posts', Controllers\Cms\PostsIndexController::class)
            ->can('view posts')
            ->name('posts');

        Route::get('post-categories', fn () => inertia('cms/post-categories/index'))
            ->can('view posts')
            ->name('post-categories');

        Route::get('pages', fn () => inertia('cms/pages/index'))
            ->can('view posts')
            ->name('pages');

        Route::get('navigation', fn () => inertia('cms/navigation/index'))
            ->can('view posts')
            ->name('navigation');

        Route::get('media', fn () => inertia('cms/media/index'))
            ->can('view posts')
            ->name('media');

        Route::get('documents', fn () => inertia('cms/documents/index'))
            ->can('view documents')
            ->name('documents');

        Route::get('staff-profiles', fn () => inertia('cms/staff-profiles/index'))
            ->can('view staff profiles')
            ->name('staff-profiles');

        Route::get('units', fn () => inertia('cms/units/index'))
            ->can('view units')
            ->name('units');

        Route::get('users', fn () => inertia('cms/users/index'))
            ->can('manage users')
            ->name('users');

        Route::get('roles-permissions', fn () => inertia('cms/roles-permissions/index'))
            ->can('manage roles')
            ->name('roles-permissions');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/dev.php';
