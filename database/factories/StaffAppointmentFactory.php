<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Position;
use App\Models\StaffAppointment;
use App\Models\StaffProfile;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StaffAppointment>
 */
class StaffAppointmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-5 years', '-6 months');
        $endDate = fake()->boolean(40)
            ? fake()->dateTimeBetween($startDate, '+1 year')
            : null;

        return [
            'staff_profile_id' => StaffProfile::factory(),
            'unit_id' => Unit::factory(),
            'position_id' => Position::factory(),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'note' => fake()->optional()->sentence(),
        ];
    }
}
