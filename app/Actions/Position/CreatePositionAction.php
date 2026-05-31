<?php

declare(strict_types=1);

namespace App\Actions\Position;

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
            return Position::query()->create([
                'name' => $attributes['name'],
                'slug' => $attributes['slug'],
                'sort_order' => $attributes['sort_order'],
                'is_active' => $attributes['is_active'],
            ]);
        });
    }
}
