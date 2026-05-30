<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Events\CmsContentChanged;
use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;

final class DeleteUnitController extends Controller
{
    public function __invoke(Unit $unit): RedirectResponse
    {
        $unit->delete();

        event(new CmsContentChanged(
            resource: 'units',
            recordId: (int) $unit->getKey(),
            title: $unit->name,
            status: $unit->is_active ? 'active' : 'inactive',
            action: 'deleted',
            message: 'Đã xóa đơn vị.',
            updatedAt: $unit->updated_at?->toIso8601String() ?? now()->toIso8601String(),
        ));

        flash('Đã xóa đơn vị.');

        return to_route('cms.units');
    }
}
