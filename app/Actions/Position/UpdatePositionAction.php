<?php

declare(strict_types=1);

namespace App\Actions\Position;

use App\Models\Position;
use Illuminate\Support\Facades\DB;

class UpdatePositionAction
{
    /**
     * @param  array{
     *     name: string,
     *     slug: string,
     *     sort_order: int,
     *     is_active: bool
     * }  $attributes
     */
    public function __invoke(Position $position, array $attributes): Position
    {
        return DB::transaction(function () use ($position, $attributes): Position {
            $position->update([
                'name' => $attributes['name'],
                'slug' => $attributes['slug'],
                'sort_order' => $attributes['sort_order'],
                'is_active' => $attributes['is_active'],
            ]);

            return $position->refresh();
        });
    }
}
