<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Position\UpdatePositionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePositionRequest;
use App\Models\Position;
use Illuminate\Http\RedirectResponse;

final class UpdatePositionController extends Controller
{
    public function __invoke(UpdatePositionRequest $request, Position $position, UpdatePositionAction $updatePosition): RedirectResponse
    {
        /** @var array{
         *     name: string,
         *     slug: string,
         *     sort_order: int,
         *     is_active: bool
         * } $validated
         */
        $validated = $request->validated();

        $updatePosition($position, $validated);

        flash('Đã cập nhật chức vụ.');

        return to_route('cms.positions');
    }
}
