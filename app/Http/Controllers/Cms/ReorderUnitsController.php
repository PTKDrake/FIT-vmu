<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Unit\ReorderUnitsAction;
use App\Events\CmsContentChanged;
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

        event(new CmsContentChanged(
            resource: 'units',
            recordId: 0,
            title: 'Thứ tự đơn vị',
            status: 'active',
            action: 'reordered',
            message: 'Đã cập nhật thứ tự đơn vị.',
            updatedAt: now()->toIso8601String(),
        ));

        flash('Đã cập nhật thứ tự đơn vị.');

        return back();
    }
}
