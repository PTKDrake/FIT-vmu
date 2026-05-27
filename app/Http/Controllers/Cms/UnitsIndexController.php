<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Inertia\Response;

final class UnitsIndexController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $status = (string) $request->query('status', 'all');

        $units = Unit::query()
            ->withCount('staffAppointments')
            ->when($status === 'active', fn ($query) => $query->where('is_active', true))
            ->when($status === 'inactive', fn ($query) => $query->where('is_active', false))
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return inertia('cms/units/index', [
            'can' => [
                'manageUnits' => $request->user()?->can('create', Unit::class) ?? false,
            ],
            'units' => $units->map(fn (Unit $unit): array => [
                'id' => $unit->getKey(),
                'name' => $unit->name,
                'slug' => $unit->slug,
                'descriptionSummary' => $this->summarizeBlockNoteContent($unit->description),
                'sortOrder' => $unit->sort_order,
                'isActive' => $unit->is_active,
                'appointmentCount' => (int) $unit->staff_appointments_count,
                'updatedAt' => $this->formatDateTime($unit->updated_at) ?? now()->toAtomString(),
            ])->all(),
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

    private function summarizeBlockNoteContent(?string $value): ?string
    {
        if (blank($value)) {
            return null;
        }

        $decoded = json_decode($value, true);

        if (! is_array($decoded)) {
            return null;
        }

        $fragments = collect($decoded)
            ->map(function (mixed $block): string {
                if (! is_array($block)) {
                    return '';
                }

                $content = $block['content'] ?? null;

                if (is_string($content)) {
                    return trim($content);
                }

                if (! is_array($content)) {
                    return '';
                }

                return collect($content)
                    ->map(fn (mixed $item): string => is_array($item) && is_string($item['text'] ?? null) ? trim($item['text']) : '')
                    ->filter()
                    ->implode(' ');
            })
            ->filter()
            ->implode(' ');

        return $fragments === '' ? null : str($fragments)->limit(120)->value();
    }
}
