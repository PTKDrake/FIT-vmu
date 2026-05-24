<?php

use App\Models\Position;
use App\Models\StaffAppointment;
use App\Models\StaffProfile;
use App\Models\Unit;
use Illuminate\Database\QueryException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;

test('units positions and staff appointments tables expose the expected domain columns', function () {
    expect(Schema::hasColumns('units', [
        'id',
        'name',
        'slug',
        'type',
        'description',
        'description_format',
        'sort_order',
        'is_active',
        'created_at',
        'updated_at',
    ]))->toBeTrue()
        ->and(Schema::hasColumns('positions', [
            'id',
            'name',
            'slug',
            'sort_order',
            'is_active',
            'created_at',
            'updated_at',
        ]))->toBeTrue()
        ->and(Schema::hasColumns('staff_appointments', [
            'id',
            'staff_profile_id',
            'unit_id',
            'position_id',
            'start_date',
            'end_date',
            'note',
            'created_at',
            'updated_at',
        ]))->toBeTrue()
        ->and(Schema::hasColumn('staff_appointments', 'is_current'))->toBeFalse();
});

test('unit and position defaults align with the mvp catalog design', function () {
    $unit = Unit::query()->create([
        'name' => 'Bo mon He thong thong tin',
        'slug' => 'bo-mon-he-thong-thong-tin',
        'type' => 'department',
    ])->refresh();

    $position = Position::query()->create([
        'name' => 'Truong bo mon',
        'slug' => 'truong-bo-mon',
    ])->refresh();

    expect($unit->description)->toBeNull()
        ->and($unit->description_format)->toBe('blocknote_json')
        ->and($unit->sort_order)->toBe(0)
        ->and($unit->is_active)->toBeTrue()
        ->and($position->sort_order)->toBe(0)
        ->and($position->is_active)->toBeTrue();
});

test('staff appointment belongs to staff profile unit and position', function () {
    $staffProfile = StaffProfile::factory()->create();
    $unit = Unit::factory()->create();
    $position = Position::factory()->create();

    $appointment = StaffAppointment::factory()->for($staffProfile)->for($unit)->for($position)->create([
        'start_date' => '2024-01-01',
        'end_date' => null,
    ]);

    expect($appointment->staffProfile->is($staffProfile))->toBeTrue()
        ->and($appointment->unit->is($unit))->toBeTrue()
        ->and($appointment->position->is($position))->toBeTrue()
        ->and($staffProfile->appointments)->toHaveCount(1)
        ->and($unit->staffAppointments)->toHaveCount(1)
        ->and($position->staffAppointments)->toHaveCount(1)
        ->and($appointment->start_date)->toBeInstanceOf(Carbon::class)
        ->and($appointment->end_date)->toBeNull();
});

test('unit and position slugs stay unique', function () {
    $unit = Unit::factory()->create([
        'slug' => 'ban-chu-nhiem',
    ]);

    $position = Position::factory()->create([
        'slug' => 'truong-khoa',
    ]);

    expect(fn () => Unit::factory()->create([
        'slug' => $unit->slug,
    ]))->toThrow(QueryException::class)
        ->and(fn () => Position::factory()->create([
            'slug' => $position->slug,
        ]))->toThrow(QueryException::class);
});
