<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\StudentGroup;
use App\Models\StudentGroupMember;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StudentGroupMember>
 */
class StudentGroupMemberFactory extends Factory
{
    public function definition(): array
    {
        return [
            'student_group_id' => StudentGroup::factory(),
            'student_code' => fake()->unique()->numerify('######'),
        ];
    }
}
