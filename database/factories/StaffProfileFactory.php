<?php

namespace Database\Factories;

use App\Models\StaffProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<StaffProfile>
 */
class StaffProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fullName = fake()->name();

        return [
            'user_id' => User::factory(),
            'academic_title' => fake()->randomElement(['TS.', 'ThS.', null]),
            'full_name' => $fullName,
            'slug' => Str::slug($fullName).'-'.fake()->unique()->numberBetween(1000, 9999),
            'avatar_id' => null,
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'bio' => json_encode([
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
            'bio_format' => 'blocknote_json',
            'is_public' => false,
        ];
    }
}
