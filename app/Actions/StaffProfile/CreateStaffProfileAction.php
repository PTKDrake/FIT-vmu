<?php

declare(strict_types=1);

namespace App\Actions\StaffProfile;

use App\Models\StaffProfile;
use Illuminate\Support\Facades\DB;

class CreateStaffProfileAction
{
    /**
     * @param  array{
     *     user_id: int,
     *     full_name: string,
     *     slug: string,
     *     avatar_id?: ?int,
     *     email?: ?string,
     *     phone?: ?string,
     *     bio?: ?string,
     *     bio_format?: string,
     *     is_public?: bool,
     *     appointments?: array<int, array{
     *         unit_id: int,
     *         position_id: int,
     *         start_date: string,
     *         end_date?: ?string,
     *         note?: ?string
     *     }>
     * }  $attributes
     */
    public function __invoke(array $attributes): StaffProfile
    {
        return DB::transaction(function () use ($attributes): StaffProfile {
            $profile = StaffProfile::query()->create([
                'user_id' => $attributes['user_id'],
                'full_name' => $attributes['full_name'],
                'slug' => $attributes['slug'],
                'avatar_id' => $attributes['avatar_id'] ?? null,
                'email' => blank($attributes['email'] ?? null) ? null : $attributes['email'],
                'phone' => blank($attributes['phone'] ?? null) ? null : $attributes['phone'],
                'bio' => blank($attributes['bio'] ?? null) ? null : $attributes['bio'],
                'bio_format' => $attributes['bio_format'] ?? 'blocknote_json',
                'is_public' => $attributes['is_public'] ?? false,
            ]);

            if (isset($attributes['appointments'])) {
                foreach ($attributes['appointments'] as $appt) {
                    $profile->appointments()->create([
                        'unit_id' => $appt['unit_id'],
                        'position_id' => $appt['position_id'],
                        'start_date' => $appt['start_date'],
                        'end_date' => blank($appt['end_date'] ?? null) ? null : $appt['end_date'],
                        'note' => blank($appt['note'] ?? null) ? null : $appt['note'],
                    ]);
                }
            }

            return $profile;
        });
    }
}
