<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Inertia\Response;

final class UnitShowPageController extends Controller
{
    public function __invoke(Unit $unit, Request $request): Response
    {
        $unit->loadCount('staffAppointments');

        return inertia('cms/units/show', [
            'can' => [
                'manageUnits' => $request->user()?->can('update', $unit) ?? false,
            ],
            'unit' => [
                'id' => $unit->getKey(),
                'name' => $unit->name,
                'slug' => $unit->slug,
                'description' => $unit->description,
                'descriptionFormat' => $unit->description_format,
                'sortOrder' => $unit->sort_order,
                'isActive' => $unit->is_active,
                'appointmentCount' => (int) $unit->staff_appointments_count,
                'updatedAt' => $this->formatDateTime($unit->updated_at) ?? now()->toAtomString(),
            ],
        ]);
    }

    private function formatDateTime(mixed $value): ?string
    {
        if ($value instanceof CarbonInterface) {
            return $value->toAtomString();
        }

        if (is_string($value) && $value !== '') {
            return $value;
        }

        return null;
    }
}
