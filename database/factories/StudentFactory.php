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
            'student_code' => $this->faker->unique()->numerify('######'),
            'class_name' => $this->faker->randomElement(['CNTT1', 'CNTT2', 'KTPM1', 'HTTT1']),
            'major' => $this->faker->randomElement(['Cong nghe thong tin', 'Ky thuat phan mem', 'He thong thong tin']),
        ];
    }
}
