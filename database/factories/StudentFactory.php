<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'student_code' => fake()->unique()->numerify('######'),
            'class_name' => fake()->randomElement(['CNTT1', 'CNTT2', 'KTPM1', 'HTTT1']),
            'major' => fake()->randomElement(['Cong nghe thong tin', 'Ky thuat phan mem', 'He thong thong tin']),
        ];
    }
}
