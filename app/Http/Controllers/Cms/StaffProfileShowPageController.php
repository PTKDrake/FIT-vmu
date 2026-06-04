<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\StaffAppointment;
use App\Models\StaffProfile;
use Carbon\CarbonInterface;
use Inertia\Response;

final class StaffProfileShowPageController extends Controller
{
    public function __invoke(StaffProfile $staffProfile): Response
    {
        $staffProfile->load(['user', 'avatar', 'appointments.unit', 'appointments.position']);

        $canManage = request()->user()?->can('update staff profiles') ?? false;
        $canEdit = request()->user()?->can('update', $staffProfile) ?? false;

        return inertia('cms/staff-profiles/show', [
            'can' => [
                'manage' => $canManage,
                'edit' => $canEdit,
            ],
            'profile' => [
                'id' => $staffProfile->id,
                'academicTitle' => $staffProfile->academic_title,
                'fullName' => $staffProfile->full_name,
                'displayName' => $staffProfile->displayName(),
                'slug' => $staffProfile->slug,
                'email' => $staffProfile->email,
                'phone' => $staffProfile->phone,
                'bio' => $staffProfile->bio,
                'bioFormat' => $staffProfile->bio_format,
                'isPublic' => $staffProfile->is_public,
                'avatarUrl' => $staffProfile->avatar?->preview_url,
                'userName' => $staffProfile->user?->name,
                'userEmail' => $staffProfile->user?->email,
                'appointments' => $staffProfile->appointments->map(fn (StaffAppointment $appointment): array => [
                    'id' => $appointment->id,
                    'unitName' => $appointment->unit?->name,
                    'positionName' => $appointment->position?->name,
                    'startDate' => $this->formatDate($appointment->start_date),
                    'endDate' => $this->formatDate($appointment->end_date),
                    'note' => $appointment->note,
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
