<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\PostCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PostCategory>
 */
class PostCategoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                'Tin tuc',
                'Thong bao',
                'Tuyen sinh',
                'Dao tao',
                'Nghien cuu khoa hoc',
                'Sinh vien',
            ]),
            'slug' => Str::slug(fake()->unique()->words(3, true)),
            'description' => fake()->optional()->paragraph(),
            'parent_id' => null,
            'sort_order' => fake()->numberBetween(0, 20),
            'is_active' => true,
        ];
    }
}
