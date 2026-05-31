<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Unit\UpdateUnitAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUnitRequest;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;

final class UpdateUnitController extends Controller
{
    public function __invoke(UpdateUnitRequest $request, Unit $unit, UpdateUnitAction $updateUnit): RedirectResponse
    {
        /** @var array{
         *     name: string,
         *     slug: string,
         *     description?: ?string,
         *     description_format: string,
         *     sort_order: int,
         *     is_active: bool
         * } $validated
         */
        $validated = $request->validated();

        $updatedUnit = $updateUnit($unit, $validated);

        flash('Đã cập nhật đơn vị.');

        return to_route('cms.units.show', $updatedUnit);
    }
}
