<?php

declare(strict_types=1);

namespace App\Actions\Unit;

use App\Events\CmsContentChanged;
use App\Models\Unit;
use Illuminate\Support\Facades\DB;

class CreateUnitAction
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
    public function __invoke(array $attributes): Unit
    {
        return DB::transaction(function () use ($attributes): Unit {
            $unit = Unit::query()->create([
                'name' => $attributes['name'],
                'slug' => $attributes['slug'],
                'description' => blank($attributes['description'] ?? null) ? null : $attributes['description'],
                'description_format' => $attributes['description_format'],
                'sort_order' => $attributes['sort_order'],
                'is_active' => $attributes['is_active'],
            ]);

            event(CmsContentChanged::forUnit(
                unit: $unit,
                action: 'created',
                message: 'Đã tạo đơn vị mới.',
            ));

            return $unit;
        });
    }
}
