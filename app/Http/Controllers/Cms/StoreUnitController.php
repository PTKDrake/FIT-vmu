<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Unit\CreateUnitAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUnitRequest;
use Illuminate\Http\RedirectResponse;

final class StoreUnitController extends Controller
{
    public function __invoke(StoreUnitRequest $request, CreateUnitAction $createUnit): RedirectResponse
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

        $unit = $createUnit($validated);

        flash('Đã tạo đơn vị mới.');

        return to_route('cms.units.show', $unit);
    }
}
