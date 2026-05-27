<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Unit\ReorderUnitsAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReorderUnitsRequest;
use Illuminate\Http\RedirectResponse;

final class ReorderUnitsController extends Controller
{
    public function __invoke(ReorderUnitsRequest $request, ReorderUnitsAction $reorderUnits): RedirectResponse
    {
        /** @var array{nodes: array<int, array{id: int, sort_order: int}>} $validated */
        $validated = $request->validated();

        $reorderUnits($validated['nodes']);

        flash('Đã cập nhật thứ tự đơn vị.');

        return back();
    }
}
