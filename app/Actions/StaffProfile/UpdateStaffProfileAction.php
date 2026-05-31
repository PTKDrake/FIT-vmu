<?php

declare(strict_types=1);

namespace App\Actions\StaffProfile;

use App\Events\CmsContentChanged;
use App\Models\StaffProfile;
use Illuminate\Support\Facades\DB;

class UpdateStaffProfileAction
{
    /**
     * @param  array{
     *     full_name: string,
     *     slug: string,
     *     avatar_id?: ?int,
     *     email?: ?string,
     *     phone?: ?string,
     *     bio?: ?string,
     *     bio_format?: string,
     *     is_public?: bool,
     *     appointments?: array<int, array{
     *         id?: ?int,
     *         unit_id: int,
     *         position_id: int,
     *         start_date: string,
     *         end_date?: ?string,
     *         note?: ?string
     *     }>
     * }  $attributes
     */
    public function __invoke(StaffProfile $staffProfile, array $attributes): StaffProfile
    {
        return DB::transaction(function () use ($staffProfile, $attributes): StaffProfile {
            $staffProfile->update([
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
                $existingIds = [];
                foreach ($attributes['appointments'] as $appt) {
                    $appointmentData = [
                        'unit_id' => $appt['unit_id'],
                        'position_id' => $appt['position_id'],
                        'start_date' => $appt['start_date'],
                        'end_date' => blank($appt['end_date'] ?? null) ? null : $appt['end_date'],
                        'note' => blank($appt['note'] ?? null) ? null : $appt['note'],
                    ];

                    if (isset($appt['id'])) {
                        $appointmentId = $appt['id'];
                        $existingIds[] = $appointmentId;
                        $staffProfile->appointments()->where('id', $appointmentId)->update($appointmentData);
                    } else {
                        $newAppt = $staffProfile->appointments()->create($appointmentData);
                        $existingIds[] = $newAppt->id;
                    }
                }
                $staffProfile->appointments()->whereNotIn('id', $existingIds)->delete();
            } else {
                $staffProfile->appointments()->delete();
            }

            event(CmsContentChanged::forStaffProfile(
                staffProfile: $staffProfile,
                action: 'updated',
                message: 'Đã cập nhật hồ sơ cán bộ.',
            ));

            return $staffProfile->refresh();
        });
    }
}
