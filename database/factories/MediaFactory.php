<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Media;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Media>
 */
class MediaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fileName = fake()->unique()->slug().'.pdf';

        return [
            'disk' => 'public',
            'path' => 'uploads/'.fake()->date('Y/m').'/'.$fileName,
            'original_name' => $fileName,
            'mime_type' => 'application/pdf',
            'size' => fake()->numberBetween(10_000, 5_000_000),
            'uploaded_by' => User::factory(),
        ];
    }
}
