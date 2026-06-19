<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\PublicSite\PublicLayoutResolver;
use App\Actions\Puck\BuildPuckDynamicDataAction;
use App\Models\SiteSetting;
use App\Models\StaffAppointment;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Inertia\Response;

final class PublicUnitController extends Controller
{
    public function __construct(
        private readonly BuildPuckDynamicDataAction $buildPuckDynamicData,
    ) {}

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, string $slug): Response
    {
        $unit = Unit::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'staffAppointments' => function (Relation $query) {
                    $query->whereHas('staffProfile', function (Builder $q) {
                        $q->where('is_public', true);
                    })
                        ->whereHas('position', function (Builder $q) {
                            $q->where('is_active', true);
                        })
                        ->where(function (Builder $q) {
                            $q->whereNull('end_date')
                                ->orWhere('end_date', '>=', now()->toDateString());
                        });
                },
                'staffAppointments.staffProfile.avatar',
                'staffAppointments.position',
            ])
            ->first();

        abort_unless($unit instanceof Unit, 404);

        // Sort appointments: position sort_order first, then staff full name
        $appointments = $unit->staffAppointments->sortBy([
            fn (StaffAppointment $a, StaffAppointment $b) => (($a->position !== null) ? $a->position->sort_order : 0) <=> (($b->position !== null) ? $b->position->sort_order : 0),
            fn (StaffAppointment $a, StaffAppointment $b) => (($a->staffProfile !== null) ? $a->staffProfile->full_name : '') <=> (($b->staffProfile !== null) ? $b->staffProfile->full_name : ''),
        ])->values();

        $staff = $appointments->map(function (StaffAppointment $appointment) {
            $profile = $appointment->staffProfile;
            $position = $appointment->position;

            if ($profile === null || $position === null) {
                return null;
            }

            return [
                'id' => $profile->id,
                'name' => $profile->displayName(),
                'position' => $position->name,
                'email' => $profile->email,
                'phone' => $profile->phone,
                'avatarUrl' => $profile->avatar?->preview_url,
            ];
        })->filter()->values();

        $layout = PublicLayoutResolver::resolve(null, SiteSetting::defaultPageLayoutId());

        /** @var User|null $viewer */
        $viewer = $request->user();

        $dynamicData = ($this->buildPuckDynamicData)(
            $viewer,
            true,
            array_filter([
                $unit->description,
                $layout['headerData'] ?? null,
                $layout['footerData'] ?? null,
                $layout['leftData'] ?? null,
                $layout['rightData'] ?? null,
            ])
        );

        return inertia('public/unit', [
            'unit' => [
                'id' => $unit->id,
                'name' => $unit->name,
                'slug' => $unit->slug,
                'description' => $unit->description,
            ],
            'staff' => $staff->all(),
            'layout' => $layout,
            'dynamicData' => $dynamicData,
        ]);
    }
}
