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

        event(CmsContentChanged::forUnit(
            unit: $unit,
            action: 'deleted',
            message: 'Đã xóa đơn vị.',
        ));

        flash('Đã xóa đơn vị.');

        return to_route('cms.units');
    }
}
