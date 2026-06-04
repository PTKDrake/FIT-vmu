<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Position;
use App\Models\StaffAppointment;
use App\Models\StaffProfile;
use App\Models\Unit;
use Carbon\CarbonInterface;
use Inertia\Response;

final class StaffProfileEditPageController extends Controller
{
    public function __invoke(StaffProfile $staffProfile): Response
    {
        $staffProfile->load(['user', 'avatar', 'appointments']);

        $units = Unit::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->all();

        $positions = Position::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->all();

        return inertia('cms/staff-profiles/edit', [
            'units' => $units,
            'positions' => $positions,
            'profile' => [
                'id' => $staffProfile->id,
                'userId' => $staffProfile->user_id,
                'academicTitle' => $staffProfile->academic_title,
                'fullName' => $staffProfile->full_name,
                'displayName' => $staffProfile->displayName(),
                'slug' => $staffProfile->slug,
                'email' => $staffProfile->email,
                'phone' => $staffProfile->phone,
                'bio' => $staffProfile->bio,
                'bioFormat' => $staffProfile->bio_format,
                'isPublic' => $staffProfile->is_public,
                'avatarId' => $staffProfile->avatar_id,
                'avatarUrl' => $staffProfile->avatar?->preview_url,
                'userEmail' => $staffProfile->user?->email,
                'userName' => $staffProfile->user?->name,
                'appointments' => $staffProfile->appointments->map(fn (StaffAppointment $appt): array => [
                    'id' => $appt->id,
                    'unit_id' => $appt->unit_id,
                    'position_id' => $appt->position_id,
                    'start_date' => $this->formatDate($appt->start_date),
                    'end_date' => $this->formatDate($appt->end_date),
                    'note' => $appt->note,
                ])->all(),
            ],
        ]);
    }

    private function formatDate(mixed $value): ?string
    {
        if ($value instanceof CarbonInterface) {
            return $value->toDateString();
        }

        if (is_string($value) && $value !== '') {
            return $value;
        }

        return null;
    }
}
