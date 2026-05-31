<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Position\CreatePositionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePositionRequest;
use Illuminate\Http\RedirectResponse;

final class StorePositionController extends Controller
{
    public function __invoke(StorePositionRequest $request, CreatePositionAction $createPosition): RedirectResponse
    {
        /** @var array{
         *     name: string,
         *     slug: string,
         *     sort_order: int,
         *     is_active: bool
         * } $validated
         */
        $validated = $request->validated();

        $createPosition($validated);

        flash('Đã tạo chức vụ mới.');

        return to_route('cms.positions');
    }
}
