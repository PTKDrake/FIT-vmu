<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\NavigationMenu;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<NavigationMenu>
 */
class NavigationMenuFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->randomElement([
            'Header chinh',
            'Footer chinh',
            'Mobile menu',
            'Sidebar public',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(100, 999),
            'location' => fake()->randomElement(['header', 'footer', 'mobile', 'sidebar']),
            'is_active' => true,
        ];
    }
}
