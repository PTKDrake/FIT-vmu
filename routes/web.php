<?php

use App\Http\Controllers;
use App\Models\Media;
use App\Models\Page;
use App\Models\Position;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\StaffProfile;
use App\Models\Unit;
use Illuminate\Support\Facades\Route;

Route::get('/', Controllers\HomeController::class)->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('dashboard', 'cms');

    Route::prefix('cms')->name('cms.')->group(function () {
        Route::get('/', Controllers\DashboardController::class)
            ->can('view admin dashboard')
            ->name('dashboard');

        Route::get('posts', Controllers\Cms\PostsIndexController::class)
            ->can('viewAny', Post::class)
            ->name('posts');
        Route::get('posts/create', Controllers\Cms\PostCreatePageController::class)
            ->can('create', Post::class)
            ->name('posts.create');
        Route::get('posts/{post}/edit', Controllers\Cms\PostEditPageController::class)
            ->can('update', 'post')
            ->name('posts.edit');
        Route::post('posts', Controllers\Cms\StorePostController::class)
            ->can('create', Post::class)
            ->name('posts.store');
        Route::patch('posts/{post}', Controllers\Cms\UpdatePostController::class)
            ->can('update', 'post')
            ->name('posts.update');
        Route::patch('posts/{post}/publish', Controllers\Cms\PublishPostController::class)
            ->can('publish', 'post')
            ->name('posts.publish');
        Route::delete('posts/{post}', Controllers\Cms\DeletePostController::class)
            ->can('delete', 'post')
            ->name('posts.destroy');

        Route::get('post-categories', Controllers\Cms\PostCategoriesIndexController::class)
            ->can('viewAny', PostCategory::class)
            ->name('post-categories');
        Route::post('post-categories', Controllers\Cms\StorePostCategoryController::class)
            ->can('create', PostCategory::class)
            ->name('post-categories.store');
        Route::patch('post-categories/{post_category}', Controllers\Cms\UpdatePostCategoryController::class)
            ->can('update', 'post_category')
            ->name('post-categories.update');
        Route::delete('post-categories/{post_category}', Controllers\Cms\DeletePostCategoryController::class)
            ->can('delete', 'post_category')
            ->name('post-categories.destroy');

        Route::get('pages', Controllers\Cms\PagesIndexController::class)
            ->can('viewAny', Page::class)
            ->name('pages');
        Route::get('pages/create', Controllers\Cms\PageCreateController::class)
            ->can('create', Page::class)
            ->name('pages.create');
        Route::post('pages', Controllers\Cms\StorePageController::class)
            ->can('create', Page::class)
            ->name('pages.store');
        Route::get('pages/{page}/edit', Controllers\Cms\PageEditorController::class)
            ->can('update', 'page')
            ->name('pages.edit');
        Route::get('pages/{page}/builder', Controllers\Cms\PageBuilderController::class)
            ->can('update', 'page')
            ->name('pages.builder');
        Route::get('pages/{page}/show', Controllers\Cms\PageShowController::class)
            ->can('view', 'page')
            ->name('pages.show');
        Route::patch('pages/{page}/metadata', Controllers\Cms\UpdatePageMetadataController::class)
            ->can('update', 'page')
            ->name('pages.metadata.update');
        Route::patch('pages/{page}/content', Controllers\Cms\UpdatePageContentController::class)
            ->can('update', 'page')
            ->name('pages.content.update');
        Route::post('pages/{page}/clone', Controllers\Cms\ClonePageController::class)
            ->can('create', Page::class)
            ->name('pages.clone');
        Route::delete('pages/{page}', Controllers\Cms\DeletePageController::class)
            ->can('delete', 'page')
            ->name('pages.destroy');

        Route::get('navigation', fn () => inertia('cms/navigation/index'))
            ->can('view posts')
            ->name('navigation');
        Route::get('navigation/{navigationMenu}', fn (int $navigationMenu) => inertia('cms/navigation/show', [
            'navigationMenuId' => $navigationMenu,
        ]))
            ->whereNumber('navigationMenu')
            ->can('view posts')
            ->name('navigation.show');

        Route::get('media', Controllers\Cms\MediaIndexController::class)
            ->can('viewAny', Media::class)
            ->name('media');
        Route::post('media', Controllers\Cms\StoreMediaController::class)
            ->can('create', Media::class)
            ->name('media.store');
        Route::patch('media/{media}/rename', Controllers\Cms\RenameMediaController::class)
            ->can('update', 'media')
            ->name('media.rename');
        Route::post('media/{media}/duplicate', Controllers\Cms\DuplicateMediaController::class)
            ->can('create', Media::class)
            ->name('media.duplicate');
        Route::delete('media/{media}', Controllers\Cms\DeleteMediaController::class)
            ->can('delete', 'media')
            ->name('media.destroy');
        Route::post('ai/blocknote', Controllers\Cms\StreamBlockNoteAiController::class)
            ->can('view admin dashboard')
            ->name('ai.blocknote');

        Route::get('documents', fn () => inertia('cms/documents/index'))
            ->can('view documents')
            ->name('documents');
        Route::get('staff-profiles', Controllers\Cms\StaffProfilesIndexController::class)
            ->can('viewAny', StaffProfile::class)
            ->name('staff-profiles');
        Route::get('staff-profiles/create', Controllers\Cms\StaffProfileCreatePageController::class)
            ->can('create', StaffProfile::class)
            ->name('staff-profiles.create');
        Route::get('staff-profiles/{staffProfile}', Controllers\Cms\StaffProfileShowPageController::class)
            ->can('view', 'staffProfile')
            ->name('staff-profiles.show');
        Route::get('staff-profiles/{staffProfile}/edit', Controllers\Cms\StaffProfileEditPageController::class)
            ->can('update', 'staffProfile')
            ->name('staff-profiles.edit');
        Route::post('staff-profiles', Controllers\Cms\StoreStaffProfileController::class)
            ->can('create', StaffProfile::class)
            ->name('staff-profiles.store');
        Route::patch('staff-profiles/{staffProfile}', Controllers\Cms\UpdateStaffProfileController::class)
            ->can('update', 'staffProfile')
            ->name('staff-profiles.update');
        Route::delete('staff-profiles/{staffProfile}', Controllers\Cms\DeleteStaffProfileController::class)
            ->can('delete', 'staffProfile')
            ->name('staff-profiles.destroy');

        Route::get('units', Controllers\Cms\UnitsIndexController::class)
            ->can('viewAny', Unit::class)
            ->name('units');
        Route::patch('units/reorder', Controllers\Cms\ReorderUnitsController::class)
            ->can('manage units')
            ->name('units.reorder');
        Route::get('units/create', Controllers\Cms\UnitCreatePageController::class)
            ->can('create', Unit::class)
            ->name('units.create');
        Route::get('units/{unit}', Controllers\Cms\UnitShowPageController::class)
            ->can('view', 'unit')
            ->name('units.show');
        Route::get('units/{unit}/edit', Controllers\Cms\UnitEditPageController::class)
            ->can('update', 'unit')
            ->name('units.edit');
        Route::post('units', Controllers\Cms\StoreUnitController::class)
            ->can('create', Unit::class)
            ->name('units.store');
        Route::patch('units/{unit}', Controllers\Cms\UpdateUnitController::class)
            ->can('update', 'unit')
            ->name('units.update');
        Route::delete('units/{unit}', Controllers\Cms\DeleteUnitController::class)
            ->can('delete', 'unit')
            ->name('units.destroy');

        Route::get('positions', Controllers\Cms\PositionsIndexController::class)
            ->can('viewAny', Position::class)
            ->name('positions');
        Route::post('positions', Controllers\Cms\StorePositionController::class)
            ->can('create', Position::class)
            ->name('positions.store');
        Route::patch('positions/{position}', Controllers\Cms\UpdatePositionController::class)
            ->can('update', 'position')
            ->name('positions.update');
        Route::delete('positions/{position}', Controllers\Cms\DeletePositionController::class)
            ->can('delete', 'position')
            ->name('positions.destroy');

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
