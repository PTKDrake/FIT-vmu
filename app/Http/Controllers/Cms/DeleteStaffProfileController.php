<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Events\CmsContentChanged;
use App\Http\Controllers\Controller;
use App\Models\StaffProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class DeleteStaffProfileController extends Controller
{
    public function __invoke(Request $request, StaffProfile $staffProfile): RedirectResponse
    {
        if ($request->user()?->cannot('delete', $staffProfile)) {
            abort(403);
        }

        $staffProfile->delete();

        event(CmsContentChanged::forStaffProfile(
            staffProfile: $staffProfile,
            action: 'deleted',
            message: 'Đã xóa hồ sơ cán bộ.',
        ));

        flash('Đã xóa hồ sơ cán bộ.');

        return to_route('cms.staff-profiles');
    }
}
