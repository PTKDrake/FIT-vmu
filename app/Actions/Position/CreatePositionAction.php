<?php

declare(strict_types=1);

namespace App\Actions\Position;

use App\Events\CmsContentChanged;
use App\Models\Position;
use Illuminate\Support\Facades\DB;

class CreatePositionAction
{
    /**
     * @param  array{
     *     name: string,
     *     slug: string,
     *     sort_order: int,
     *     is_active: bool
     * }  $attributes
     */
    public function __invoke(array $attributes): Position
    {
        return DB::transaction(function () use ($attributes): Position {
            $position = Position::query()->create([
                'name' => $attributes['name'],
                'slug' => $attributes['slug'],
                'sort_order' => $attributes['sort_order'],
                'is_active' => $attributes['is_active'],
            ]);

            event(CmsContentChanged::forResource(
                resource: 'positions',
                recordId: $position->getKey(),
                title: $position->name,
                status: $position->is_active ? 'active' : 'inactive',
                action: 'created',
                message: 'Đã tạo chức vụ.',
                updatedAt: $position->updated_at,
            ));

            return $position;
        });
    }
}
