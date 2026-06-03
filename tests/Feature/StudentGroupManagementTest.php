<?php

use App\Models\StudentGroup;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('cms student groups page renders for editors', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $this->actingAs($editor)
        ->get('/cms/student-groups')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/student-groups/index')
            ->where('can.createGroup', true)
            ->where('can.createGlobalGroup', true)
        );
});

test('cms student groups can be created from mixed pasted delimiters without requiring student accounts', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $this->actingAs($editor)
        ->post('/cms/student-groups', [
            'name' => 'Nhóm sinh viên thử nghiệm',
            'code' => 'TTM63DH',
            'scope' => 'private',
            'student_codes' => "94903, 123456\n20240001 20240002;20240003",
        ])
        ->assertRedirect('/cms/student-groups');

    $group = StudentGroup::query()
        ->where('code', 'TTM63DH')
        ->firstOrFail();

    expect($group->owner_id)->toBe($editor->getKey())
        ->and($group->members()->pluck('student_code')->sort()->values()->all())
        ->toBe(['94903', '123456', '20240001', '20240002', '20240003']);
});

test('cms student groups can be updated and deleted', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $group = StudentGroup::factory()->for($editor, 'owner')->create([
        'name' => 'Nhóm ban đầu',
        'code' => 'GROUP001',
    ]);
    $group->members()->createMany([
        ['student_code' => '100001'],
        ['student_code' => '100002'],
    ]);

    $this->actingAs($editor)
        ->patch("/cms/student-groups/{$group->getKey()}", [
            'name' => 'Nhóm đã cập nhật',
            'code' => 'GROUP002',
            'scope' => 'global',
            'student_codes' => "200001\n200002",
        ])
        ->assertRedirect('/cms/student-groups');

    expect($group->fresh()?->name)->toBe('Nhóm đã cập nhật')
        ->and($group->fresh()?->owner_id)->toBeNull()
        ->and($group->fresh()?->members()->pluck('student_code')->sort()->values()->all())
        ->toBe(['200001', '200002']);

    $this->actingAs($editor)
        ->delete("/cms/student-groups/{$group->getKey()}")
        ->assertRedirect('/cms/student-groups');

    $this->assertDatabaseMissing('student_groups', [
        'id' => $group->getKey(),
    ]);
});
