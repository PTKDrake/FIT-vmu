<?php

declare(strict_types=1);

namespace App\Actions\Unit;

use App\Events\CmsContentChanged;
use App\Models\Unit;
use Illuminate\Support\Facades\DB;

class UpdateUnitAction
{
    /**
     * @param  array{
     *     name: string,
     *     slug: string,
     *     description?: ?string,
     *     description_format: string,
     *     sort_order: int,
     *     is_active: bool
     * }  $attributes
     */
    public function __invoke(Unit $unit, array $attributes): Unit
    {
        return DB::transaction(function () use ($unit, $attributes): Unit {
            $unit->update([
                'name' => $attributes['name'],
                'slug' => $attributes['slug'],
                'description' => blank($attributes['description'] ?? null) ? null : $attributes['description'],
                'description_format' => $attributes['description_format'],
                'sort_order' => $attributes['sort_order'],
                'is_active' => $attributes['is_active'],
            ]);

            event(new CmsContentChanged(
                resource: 'units',
                recordId: (int) $unit->getKey(),
                title: $unit->name,
                status: $unit->is_active ? 'active' : 'inactive',
                action: 'updated',
                message: 'Đã cập nhật đơn vị.',
                updatedAt: $unit->updated_at?->toIso8601String() ?? now()->toIso8601String(),
            ));

            return $unit->refresh();
        });
    }
}
