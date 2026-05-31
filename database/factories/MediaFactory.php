<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Media;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

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
        $extension = 'pdf';
        $storageName = Str::lower((string) Str::ulid()).'.'.$extension;
        $displayName = fake()->unique()->slug().'.'.$extension;

        return [
            'disk' => 'public',
            'path' => 'media/'.fake()->date('Y/m').'/'.$storageName,
            'original_name' => $storageName,
            'display_name' => $displayName,
            'mime_type' => 'application/pdf',
            'size' => fake()->numberBetween(10_000, 5_000_000),
            'uploaded_by' => User::factory(),
        ];
    }
}
