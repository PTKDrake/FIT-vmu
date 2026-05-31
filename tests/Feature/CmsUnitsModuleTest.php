<?php

use App\Events\CmsContentChanged;
use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Position;
use App\Models\Unit;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('unit and position policies follow role permissions', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $student = User::factory()->create();
    $student->assignRole('student');

    $unit = Unit::factory()->create();
    $position = Position::factory()->create();

    expect(Gate::forUser($editor)->allows('viewAny', Unit::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('view', $unit))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('create', Unit::class))->toBeFalse()
        ->and(Gate::forUser($editor)->allows('viewAny', Position::class))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('create', Unit::class))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('update', $unit))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('create', Position::class))->toBeTrue()
        ->and(Gate::forUser($admin)->allows('delete', $position))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('viewAny', Unit::class))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('create', Unit::class))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('create', Position::class))->toBeFalse()
        ->and(Gate::forUser($student)->allows('viewAny', Unit::class))->toBeFalse()
        ->and(Gate::forUser($student)->allows('viewAny', Position::class))->toBeFalse();
});

test('cms units index renders a flat table and unit detail pages for viewers', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $activeUnit = Unit::factory()->create([
        'name' => 'Khoa Công nghệ thông tin',
        'slug' => 'khoa-cong-nghe-thong-tin',
        'sort_order' => 1,
        'is_active' => true,
    ]);

    Unit::factory()->create([
        'name' => 'Trung tâm nghiên cứu số',
        'slug' => 'trung-tam-nghien-cuu-so',
        'sort_order' => 2,
        'is_active' => false,
    ]);

    $this->actingAs($editor)
        ->get('/cms/units?search=Công%20nghệ&status=active')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/units/index')
            ->where('can.manageUnits', false)
            ->where('units.0.id', $activeUnit->getKey())
            ->where('units.0.name', 'Khoa Công nghệ thông tin')
        );

    $this->actingAs($editor)
        ->get("/cms/units/{$activeUnit->getKey()}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/units/show')
            ->where('unit.id', $activeUnit->getKey())
            ->where('unit.name', 'Khoa Công nghệ thông tin')
        );
});

test('cms units inertia xhr response keeps collection data under props', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    Unit::factory()->create([
        'name' => 'Khoa Công nghệ thông tin',
        'slug' => 'khoa-cong-nghe-thong-tin',
        'sort_order' => 1,
        'is_active' => true,
    ]);

    $version = app(HandleInertiaRequests::class)->version(request());

    $response = $this->actingAs($editor)
        ->withHeaders([
            'X-Inertia' => 'true',
            'X-Inertia-Version' => (string) $version,
            'X-Requested-With' => 'XMLHttpRequest',
        ])
        ->get('/cms/units?search=Công%20nghệ&status=active');

    $response->assertOk()
        ->assertJsonPath('component', 'cms/units/index')
        ->assertJsonPath('props.units.0.name', 'Khoa Công nghệ thông tin');

    expect($response->json('units'))->toBeNull();
});

test('admin can access unit create and edit pages and persist changes', function () {
    Event::fake([CmsContentChanged::class]);

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->get('/cms/units/create')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/units/create')
            ->where('unit.sortOrder', 1)
        );

    $this->actingAs($admin)
        ->post('/cms/units', [
            'name' => 'Bộ môn Dữ liệu biển',
            'slug' => 'bo-mon-du-lieu-bien',
            'description' => blockNoteJson('Đơn vị thử nghiệm phẳng.'),
            'description_format' => 'blocknote_json',
            'sort_order' => 15,
            'is_active' => true,
        ])
        ->assertRedirect();

    $unit = Unit::query()->where('slug', 'bo-mon-du-lieu-bien')->firstOrFail();

    $this->actingAs($admin)
        ->get("/cms/units/{$unit->getKey()}/edit")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/units/edit')
            ->where('unit.id', $unit->getKey())
        );

    $this->patch("/cms/units/{$unit->getKey()}", [
        'name' => 'Bộ môn Dữ liệu và AI biển',
        'slug' => 'bo-mon-du-lieu-va-ai-bien',
        'description' => blockNoteJson('Đã cập nhật mô tả BlockNote.'),
        'description_format' => 'blocknote_json',
        'sort_order' => 16,
        'is_active' => false,
    ])->assertRedirect("/cms/units/{$unit->getKey()}");

    expect($unit->refresh()->name)->toBe('Bộ môn Dữ liệu và AI biển')
        ->and($unit->is_active)->toBeFalse();

    Event::assertDispatchedTimes(CmsContentChanged::class, 2);
});

test('admin can reorder units from the cms index page', function () {
    Event::fake([CmsContentChanged::class]);

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $firstUnit = Unit::factory()->create([
        'name' => 'Khoa Kỹ thuật biển',
        'slug' => 'khoa-ky-thuat-bien',
        'sort_order' => 1,
    ]);

    $secondUnit = Unit::factory()->create([
        'name' => 'Khoa Công nghệ thông tin',
        'slug' => 'khoa-cong-nghe-thong-tin',
        'sort_order' => 2,
    ]);

    $thirdUnit = Unit::factory()->create([
        'name' => 'Trung tâm nghiên cứu số',
        'slug' => 'trung-tam-nghien-cuu-so',
        'sort_order' => 3,
    ]);

    $this->actingAs($admin)
        ->patch('/cms/units/reorder', [
            'nodes' => [
                [
                    'id' => $thirdUnit->getKey(),
                    'sort_order' => 1,
                ],
                [
                    'id' => $firstUnit->getKey(),
                    'sort_order' => 2,
                ],
                [
                    'id' => $secondUnit->getKey(),
                    'sort_order' => 3,
                ],
            ],
        ])
        ->assertRedirect();

    expect($thirdUnit->refresh()->sort_order)->toBe(1)
        ->and($firstUnit->refresh()->sort_order)->toBe(2)
        ->and($secondUnit->refresh()->sort_order)->toBe(3);

    Event::assertDispatchedTimes(CmsContentChanged::class, 1);
});

test('admin can delete a unit and broadcast the change', function () {
    Event::fake([CmsContentChanged::class]);

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $unit = Unit::factory()->create([
        'name' => 'Khoa Công nghệ hàng hải',
        'slug' => 'khoa-cong-nghe-hang-hai',
    ]);

    $this->actingAs($admin)
        ->delete("/cms/units/{$unit->getKey()}")
        ->assertRedirect('/cms/units');

    $this->assertDatabaseMissing('units', [
        'id' => $unit->getKey(),
    ]);

    Event::assertDispatchedTimes(CmsContentChanged::class, 1);
});

test('positions module is separated and admin can manage positions on its own page', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    Position::factory()->create([
        'name' => 'Trưởng bộ môn',
        'slug' => 'truong-bo-mon',
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $this->actingAs($editor)
        ->get('/cms/positions')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cms/positions/index')
            ->where('can.managePositions', false)
            ->where('positions.data.0.name', 'Trưởng bộ môn')
        );

    $this->actingAs($admin)
        ->post('/cms/positions', [
            'name' => 'Điều phối học thuật',
            'slug' => 'dieu-phoi-hoc-thuat',
            'sort_order' => 25,
            'is_active' => true,
        ])
        ->assertRedirect('/cms/positions');

    $position = Position::query()->where('slug', 'dieu-phoi-hoc-thuat')->firstOrFail();

    $this->patch("/cms/positions/{$position->getKey()}", [
        'name' => 'Điều phối học thuật chương trình',
        'slug' => 'dieu-phoi-hoc-thuat-chuong-trinh',
        'sort_order' => 26,
        'is_active' => false,
    ])->assertRedirect('/cms/positions');

    $this->delete("/cms/positions/{$position->getKey()}")
        ->assertRedirect('/cms/positions');

    $this->assertDatabaseMissing('positions', [
        'id' => $position->getKey(),
    ]);
});

test('cms positions inertia xhr response keeps collection data under props', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    Position::factory()->create([
        'name' => 'Trưởng bộ môn',
        'slug' => 'truong-bo-mon',
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $version = app(HandleInertiaRequests::class)->version(request());

    $response = $this->actingAs($editor)
        ->withHeaders([
            'X-Inertia' => 'true',
            'X-Inertia-Version' => (string) $version,
            'X-Requested-With' => 'XMLHttpRequest',
        ])
        ->get('/cms/positions?search=Trưởng');

    $response->assertOk()
        ->assertJsonPath('component', 'cms/positions/index')
        ->assertJsonPath('props.positions.data.0.name', 'Trưởng bộ môn');

    expect($response->json('positions'))->toBeNull();
});

function blockNoteJson(string $text): string
{
    return json_encode([
        [
            'id' => 'block-1',
            'type' => 'paragraph',
            'props' => [],
            'content' => [
                [
                    'type' => 'text',
                    'text' => $text,
                    'styles' => [],
                ],
            ],
            'children' => [],
        ],
    ], JSON_THROW_ON_ERROR);
}
