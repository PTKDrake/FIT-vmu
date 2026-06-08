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
        $fullName = $this->faker->name();

        return [
            'user_id' => User::factory(),
            'academic_title' => $this->faker->randomElement(['TS.', 'ThS.', null]),
            'full_name' => $fullName,
            'slug' => Str::slug($fullName).'-'.$this->faker->unique()->numberBetween(1000, 9999),
            'avatar_id' => null,
            'email' => $this->faker->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'bio' => json_encode([
                [
                    'id' => (string) Str::uuid(),
                    'type' => 'paragraph',
                    'props' => [],
                    'content' => [
                        [
                            'type' => 'text',
                            'text' => $this->faker->sentence(),
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
