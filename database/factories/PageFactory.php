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
        /** @var string $title */
        $title = $this->faker->randomElement([
            'Trang chu',
            'Gioi thieu',
            'Lien he',
            'Tuyen sinh',
            'Co cau to chuc',
        ]);

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.$this->faker->unique()->numberBetween(100, 999),
            'excerpt' => $this->faker->optional()->paragraph(),
            'seo_title' => $this->faker->optional()->sentence(6),
            'seo_description' => $this->faker->optional()->sentence(12),
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
            'visibility' => 'public',
            'site_layout_id' => null,
            'thumbnail_id' => Media::factory(),
            'author_id' => User::factory(),
            'status' => $this->faker->randomElement(['draft', 'pending', 'published', 'rejected']),
            'published_at' => $this->faker->optional()->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
