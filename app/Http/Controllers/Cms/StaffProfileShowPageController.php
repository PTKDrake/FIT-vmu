<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\StaffProfile;
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
                'fullName' => $staffProfile->full_name,
                'slug' => $staffProfile->slug,
                'email' => $staffProfile->email,
                'phone' => $staffProfile->phone,
                'bio' => $staffProfile->bio,
                'bioFormat' => $staffProfile->bio_format,
                'isPublic' => $staffProfile->is_public,
                'sortOrder' => $staffProfile->sort_order,
                'avatarUrl' => $staffProfile->avatar?->preview_url,
                'userName' => $staffProfile->user?->name,
                'userEmail' => $staffProfile->user?->email,
                'appointments' => $staffProfile->appointments->map(fn ($appointment) => [
                    'id' => $appointment->id,
                    'unitName' => $appointment->unit?->name,
                    'positionName' => $appointment->position?->name,
                    'startDate' => $appointment->start_date?->toDateString(),
                    'endDate' => $appointment->end_date?->toDateString(),
                    'note' => $appointment->note,
                ])->all(),
            ],
        ]);
    }
}
