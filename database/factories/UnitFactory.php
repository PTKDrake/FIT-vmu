<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Unit>
 */
class UnitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->randomElement([
            'Ban chu nhiem',
            'Bo mon Khoa hoc may tinh',
            'Bo mon He thong thong tin',
            'Bo mon Truyen thong va mang may tinh',
            'Bo mon Ky thuat may tinh',
            'Bo mon Tin hoc dai cuong',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(100, 999),
            'type' => fake()->randomElement(['board', 'department', 'other']),
            'description' => json_encode([
                [
                    'id' => (string) Str::uuid(),
                    'type' => 'paragraph',
                    'props' => [],
                    'content' => [
                        [
                            'type' => 'text',
                            'text' => fake()->sentence(),
                            'styles' => [],
                        ],
                    ],
                    'children' => [],
                ],
            ], JSON_THROW_ON_ERROR),
            'description_format' => 'blocknote_json',
            'sort_order' => fake()->numberBetween(0, 20),
            'is_active' => true,
        ];
    }
}
