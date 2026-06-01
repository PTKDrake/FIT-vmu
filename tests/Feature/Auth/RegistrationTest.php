<?php

use App\Models\Student;
use App\Models\User;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertSessionHas('message', __('auth.registered'));
    $response->assertRedirect(route('home', absolute: false));

    expect(User::query()->where('email', 'test@example.com')->exists())->toBeTrue();
});

test('student registration auto creates a student profile from vmu student email', function () {
    $response = $this->post('/register', [
        'name' => 'Kien Student',
        'email' => 'kien94903@st.vimaru.edu.vn',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('home', absolute: false));

    $user = User::query()->where('email', 'kien94903@st.vimaru.edu.vn')->firstOrFail();
    $student = $user->student()->first();

    expect($student)->not->toBeNull()
        ->and($student?->student_code)->toBe('94903')
        ->and($student?->user_id)->toBe($user->id);
});

test('registration does not create duplicate student profile when student code already exists', function () {
    $existingStudent = Student::factory()->create([
        'student_code' => '94903',
    ]);

    $response = $this->post('/register', [
        'name' => 'Kien Duplicate',
        'email' => 'kien94903@st.vimaru.edu.vn',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('home', absolute: false));

    $user = User::query()->where('email', 'kien94903@st.vimaru.edu.vn')->firstOrFail();

    expect($user->student()->doesntExist())->toBeTrue()
        ->and(Student::query()->where('student_code', '94903')->count())->toBe(1)
        ->and($existingStudent->fresh())->not->toBeNull();
});
