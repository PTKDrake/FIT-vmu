<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\StudentGroup;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<StudentGroup>
 */
class StudentGroupFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->randomElement([
            'TTM63DH',
            'CNTT K63',
            'Nhóm thực tập cảng số',
            'Sinh viên hỗ trợ tuyển sinh',
        ]);

        return [
            'name' => $name,
            'code' => Str::upper(fake()->unique()->bothify('GRP###??')),
            'owner_id' => User::factory(),
        ];
    }

    public function global(): static
    {
        return $this->state(fn (): array => ['owner_id' => null]);
    }
}
