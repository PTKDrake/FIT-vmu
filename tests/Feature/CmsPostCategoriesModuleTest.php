<?php

use App\Models\PostCategory;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('post category policies follow role permissions', function () {
    $viewer = User::factory()->create();
    $viewer->givePermissionTo('view post categories');

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $student = User::factory()->create();
    $student->assignRole('student');

    $category = PostCategory::factory()->create();

    expect(Gate::forUser($viewer)->allows('viewAny', PostCategory::class))->toBeTrue()
        ->and(Gate::forUser($viewer)->allows('view', $category))->toBeTrue()
        ->and(Gate::forUser($viewer)->allows('create', PostCategory::class))->toBeFalse()
        ->and(Gate::forUser($editor)->allows('create', PostCategory::class))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('create', PostCategory::class))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('update', $category))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('delete', $category))->toBeTrue()
        ->and(Gate::forUser($student)->allows('viewAny', PostCategory::class))->toBeFalse();
});

test('cms post categories index renders a correct list and parent options for viewers', function () {
    $viewer = User::factory()->create();
    $viewer->givePermissionTo('view post categories');

    $parentCategory = PostCategory::factory()->create([
        'name' => 'Đào tạo',
        'slug' => 'dao-tao',
        'sort_order' => 1,
        'is_active' => true,
    ]);

    $childCategory = PostCategory::factory()->create([
        'name' => 'Đào tạo chính quy',
        'slug' => 'dao-tao-chinh-quy',
        'parent_id' => $parentCategory->id,
        'sort_order' => 2,
        'is_active' => true,
    ]);

    $this->actingAs($viewer)
        ->get('/cms/post-categories?search=chính%20quy')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/post-categories/index')
            ->where('can.manageCategories', false)
            ->where('categories.data.0.id', $childCategory->id)
            ->where('categories.data.0.name', 'Đào tạo chính quy')
            ->where('categories.data.0.parentName', 'Đào tạo')
            ->has('parentOptions')
        );
});

test('cms post category can be stored by managers', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $parentCategory = PostCategory::factory()->create();

    $payload = [
        'name' => 'Tin tức khoa học',
        'slug' => 'tin-tuc-khoa-hoc',
        'description' => '[{"type":"paragraph","content":"Mô tả khoa học"}]',
        'parent_id' => $parentCategory->id,
        'sort_order' => 5,
        'is_active' => true,
    ];

    $response = $this->actingAs($admin)
        ->post('/cms/post-categories', $payload);

    $response->assertRedirect('/cms/post-categories');
    $this->assertDatabaseHas('post_categories', [
        'name' => 'Tin tức khoa học',
        'slug' => 'tin-tuc-khoa-hoc',
        'parent_id' => $parentCategory->id,
        'sort_order' => 5,
        'is_active' => 1,
    ]);
});

test('cms post category update logic preserves updates and handles validation', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $category = PostCategory::factory()->create([
        'name' => 'Danh mục gốc',
        'slug' => 'danh-muc-goc',
        'is_active' => false,
    ]);

    // Check self-parent validation constraint in request
    $this->actingAs($admin)
        ->patch("/cms/post-categories/{$category->id}", [
            'name' => 'Tên mới',
            'slug' => 'slug-moi',
            'parent_id' => $category->id, // self parent is invalid
            'sort_order' => 10,
            'is_active' => true,
        ])
        ->assertSessionHasErrors(['parent_id']);

    // Valid update
    $this->actingAs($admin)
        ->patch("/cms/post-categories/{$category->id}", [
            'name' => 'Danh mục cập nhật',
            'slug' => 'danh-muc-cap-nhat',
            'parent_id' => null,
            'sort_order' => 10,
            'is_active' => true,
            'description' => 'Updated Description',
        ])
        ->assertRedirect('/cms/post-categories');

    $this->assertDatabaseHas('post_categories', [
        'id' => $category->id,
        'name' => 'Danh mục cập nhật',
        'slug' => 'danh-muc-cap-nhat',
        'parent_id' => null,
        'sort_order' => 10,
        'is_active' => 1,
        'description' => 'Updated Description',
    ]);
});

test('cms post category can be deleted', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $category = PostCategory::factory()->create();

    $this->actingAs($admin)
        ->delete("/cms/post-categories/{$category->id}")
        ->assertRedirect('/cms/post-categories');

    $this->assertDatabaseMissing('post_categories', [
        'id' => $category->id,
    ]);
});
