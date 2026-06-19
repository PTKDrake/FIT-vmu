<?php

use App\Models\Position;
use App\Models\StaffAppointment;
use App\Models\StaffProfile;
use App\Models\Unit;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('public unit detail page returns 200 with correct inertia component and props', function () {
    $unit = Unit::factory()->create([
        'name' => 'Bộ môn Hệ thống thông tin',
        'slug' => 'bo-mon-he-thong-thong-tin',
        'is_active' => true,
        'description' => json_encode([['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Hello World']]]]),
    ]);

    $user = User::factory()->create();
    $profile = StaffProfile::factory()->create([
        'user_id' => $user->id,
        'full_name' => 'TS. Nguyễn Hạnh Phúc',
        'is_public' => true,
    ]);

    $position = Position::factory()->create([
        'name' => 'Trưởng bộ môn',
        'sort_order' => 1,
        'is_active' => true,
    ]);

    StaffAppointment::factory()->create([
        'staff_profile_id' => $profile->id,
        'unit_id' => $unit->id,
        'position_id' => $position->id,
        'start_date' => now()->subYear(),
        'end_date' => null,
    ]);

    $this->get('/don-vi/bo-mon-he-thong-thong-tin')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/unit')
            ->where('unit.name', 'Bộ môn Hệ thống thông tin')
            ->where('unit.slug', 'bo-mon-he-thong-thong-tin')
            ->has('staff', 1)
            ->where('staff.0.name', 'TS. Nguyễn Hạnh Phúc')
            ->where('staff.0.position', 'Trưởng bộ môn')
            ->has('layout')
            ->has('dynamicData')
        );
});

test('inactive unit returns 404', function () {
    $unit = Unit::factory()->create([
        'slug' => 'bo-mon-an',
        'is_active' => false,
    ]);

    $this->get('/don-vi/bo-mon-an')
        ->assertNotFound();
});

test('non-existent unit returns 404', function () {
    $this->get('/don-vi/bo-mon-khong-ton-tai')
        ->assertNotFound();
});
