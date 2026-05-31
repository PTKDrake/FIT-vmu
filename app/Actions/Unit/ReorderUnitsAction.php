<?php

declare(strict_types=1);

namespace App\Actions\Unit;

use App\Models\Unit;
use Illuminate\Support\Facades\DB;

class ReorderUnitsAction
{
    /**
     * @param  array<int, array{id: int, sort_order: int}>  $nodes
     */
    public function __invoke(array $nodes): void
    {
        DB::transaction(function () use ($nodes): void {
            foreach ($nodes as $node) {
                Unit::query()
                    ->whereKey($node['id'])
                    ->update(['sort_order' => $node['sort_order']]);
            }
        });
    }
}
