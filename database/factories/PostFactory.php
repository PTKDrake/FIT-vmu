<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Media;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    public function configure(): static
    {
        return $this->afterCreating(function (Post $post): void {
            if ($post->categories()->exists()) {
                return;
            }

            $category = PostCategory::factory()->create();

            $post->categories()->sync([$category->getKey()]);
        });
    }

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(6);

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.$this->faker->unique()->numberBetween(100, 999),
            'excerpt' => $this->faker->optional()->paragraph(),
            'content' => json_encode([
                [
                    'id' => (string) Str::uuid(),
                    'type' => 'paragraph',
                    'props' => [],
                    'content' => [
                        [
                            'type' => 'text',
                            'text' => $this->faker->paragraph(),
                            'styles' => [],
                        ],
                    ],
                    'children' => [],
                ],
            ], JSON_THROW_ON_ERROR),
            'content_format' => 'blocknote_json',
            'visibility' => 'public',
            'thumbnail_id' => Media::factory(),
            'author_id' => User::factory(),
            'status' => $this->faker->randomElement(['draft', 'pending', 'published', 'rejected']),
            'published_at' => $this->faker->optional()->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
