<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Media;
use App\Models\Page;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Page>
 */
class PageFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->randomElement([
            'Trang chu',
            'Gioi thieu',
            'Lien he',
            'Tuyen sinh',
            'Co cau to chuc',
        ]);

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(100, 999),
            'excerpt' => fake()->optional()->paragraph(),
            'seo_title' => fake()->optional()->sentence(6),
            'seo_description' => fake()->optional()->sentence(12),
            'content' => json_encode([
                'root' => [
                    'props' => [
                        'title' => $title,
                    ],
                    'children' => [],
                ],
                'content' => [],
                'zones' => [],
            ], JSON_THROW_ON_ERROR),
            'content_format' => 'puck_json',
            'thumbnail_id' => Media::factory(),
            'author_id' => User::factory(),
            'status' => fake()->randomElement(['draft', 'pending', 'published', 'rejected']),
            'published_at' => fake()->optional()->dateTimeBetween('-1 year', 'now'),
            'template_key' => fake()->randomElement(['default', 'landing', 'fullwidth', 'blank', 'sidebar-right']),
            'template_data' => null,
        ];
    }
}
