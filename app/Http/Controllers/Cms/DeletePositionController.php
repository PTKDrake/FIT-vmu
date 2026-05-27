<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Position;
use Illuminate\Http\RedirectResponse;

final class DeletePositionController extends Controller
{
    public function __invoke(Position $position): RedirectResponse
    {
        $position->delete();

        flash('Đã xóa chức vụ.');

        return to_route('cms.positions');
    }
}
