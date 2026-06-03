<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Document;
use App\Models\DocumentRow;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DocumentRow>
 */
class DocumentRowFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'document_id' => Document::factory(),
            'student_code' => fake()->numerify('######'),
            'data' => [
                'student_code' => fake()->numerify('######'),
                'score' => fake()->numberBetween(0, 100),
                'note' => fake()->sentence(),
            ],
            'row_index' => fake()->numberBetween(1, 300),
        ];
    }
}
