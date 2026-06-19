<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Events\CmsContentChanged;
use App\Http\Controllers\Controller;
use App\Models\Position;
use Illuminate\Http\RedirectResponse;

final class DeletePositionController extends Controller
{
    public function __invoke(Position $position): RedirectResponse
    {
        $position->delete();

        event(CmsContentChanged::forResource(
            resource: 'positions',
            recordId: $position->getKey(),
            title: $position->name,
            status: $position->is_active ? 'active' : 'inactive',
            action: 'deleted',
            message: 'Đã xóa chức vụ.',
            updatedAt: $position->updated_at,
        ));

        flash('Đã xóa chức vụ.');

        return to_route('cms.positions');
    }
}
