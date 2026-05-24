<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Document;
use App\Models\Media;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(5);

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(100, 999),
            'description' => json_encode([
                [
                    'id' => (string) Str::uuid(),
                    'type' => 'paragraph',
                    'props' => [],
                    'content' => [
                        [
                            'type' => 'text',
                            'text' => fake()->paragraph(),
                            'styles' => [],
                        ],
                    ],
                    'children' => [],
                ],
            ], JSON_THROW_ON_ERROR),
            'description_format' => 'blocknote_json',
            'file_id' => Media::factory(),
            'owner_id' => User::factory(),
            'document_type' => fake()->randomElement(['lecture', 'exercise', 'exam', 'form', 'score', 'announcement', 'other']),
            'visibility' => fake()->randomElement(['public', 'login_required', 'students', 'staff', 'private', 'student_code']),
            'status' => fake()->randomElement(['draft', 'pending', 'published', 'rejected']),
            'document_mode' => fake()->randomElement(['file', 'preview', 'student_table']),
            'published_at' => fake()->optional()->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
