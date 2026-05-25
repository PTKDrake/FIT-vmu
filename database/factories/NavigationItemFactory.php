<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NavigationItem>
 */
class NavigationItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'menu_id' => NavigationMenu::factory(),
            'parent_id' => null,
            'title' => fake()->words(2, true),
            'type' => 'custom_url',
            'linkable_type' => null,
            'linkable_id' => null,
            'url' => '/'.fake()->slug(),
            'target' => fake()->randomElement(['_self', '_blank']),
            'sort_order' => fake()->numberBetween(0, 20),
            'is_active' => true,
        ];
    }
}
