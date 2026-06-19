<?php

use App\Models\StaffProfile;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Schema;

test('students and staff profiles tables expose the expected domain columns', function () {
    expect(Schema::hasColumns('students', [
        'id',
        'user_id',
        'student_code',
        'class_name',
        'major',
        'created_at',
        'updated_at',
    ]))->toBeTrue()
        ->and(Schema::hasColumns('staff_profiles', [
            'id',
            'user_id',
            'academic_title',
            'full_name',
            'slug',
            'avatar_id',
            'email',
            'phone',
            'bio',
            'bio_format',
            'is_public',
            'created_at',
            'updated_at',
        ]))->toBeTrue();
});

test('user can own one student and one staff profile record', function () {
    $user = User::factory()->create();
    $student = Student::factory()->for($user)->create();
    $staffProfile = StaffProfile::factory()->for($user)->create();

    expect($student->user->is($user))->toBeTrue()
        ->and($staffProfile->user->is($user))->toBeTrue()
        ->and($user->student?->is($student))->toBeTrue()
        ->and($user->staffProfile?->is($staffProfile))->toBeTrue();
});

test('staff profiles can be created before linking user accounts', function () {
    $firstProfile = StaffProfile::factory()->create([
        'user_id' => null,
    ]);

    $secondProfile = StaffProfile::factory()->create([
        'user_id' => null,
    ]);

    expect($firstProfile->user_id)->toBeNull()
        ->and($firstProfile->user)->toBeNull()
        ->and($secondProfile->user_id)->toBeNull();
});

test('student_code and user ownership stay unique', function () {
    $user = User::factory()->create();
    $student = Student::factory()->for($user)->create();

    expect(fn () => Student::factory()->create([
        'user_id' => $user->id,
        'student_code' => fake()->unique()->numerify('######'),
    ]))->toThrow(QueryException::class)
        ->and(fn () => Student::factory()->create([
            'student_code' => $student->student_code,
        ]))->toThrow(QueryException::class);
});

test('staff profile defaults match the mvp content storage convention', function () {
    $user = User::factory()->create();

    $staffProfile = StaffProfile::query()->create([
        'user_id' => $user->id,
        'academic_title' => 'TS.',
        'full_name' => 'Nguyen Van A',
        'slug' => 'nguyen-van-a',
    ])->refresh();

    expect($staffProfile->bio)->toBeNull()
        ->and($staffProfile->academic_title)->toBe('TS.')
        ->and($staffProfile->bio_format)->toBe('blocknote_json')
        ->and($staffProfile->is_public)->toBeFalse();
});
