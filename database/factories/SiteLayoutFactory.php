<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\SiteLayout;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<SiteLayout>
 */
class SiteLayoutFactory extends Factory
{
    public function definition(): array
    {
        /** @var string $name */
        $name = fake()->unique()->randomElement([
            'Default Public Layout',
            'Admissions Layout',
            'Department Layout',
            'News Layout',
            'Minimal Layout',
        ]);

        return [
            'name' => $name,
            'key' => Str::slug($name).'-'.fake()->unique()->numberBetween(100, 999),
            'header_data' => $this->emptyPuckData(),
            'footer_data' => $this->emptyPuckData(),
            'left_data' => null,
            'right_data' => null,
            'status' => fake()->randomElement(['draft', 'published']),
            'is_default' => false,
        ];
    }

    public function published(): self
    {
        return $this->state(fn (): array => [
            'status' => 'published',
        ]);
    }

    public function default(): self
    {
        return $this->published()->state(fn (): array => [
            'is_default' => true,
        ]);
    }

    private function emptyPuckData(): string
    {
        return json_encode([
            'root' => [
                'props' => [],
            ],
            'content' => [],
            'zones' => [],
        ], JSON_THROW_ON_ERROR);
    }
}
