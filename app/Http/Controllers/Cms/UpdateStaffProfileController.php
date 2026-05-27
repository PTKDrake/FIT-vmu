<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Media\CreateMediaAction;
use App\Actions\StaffProfile\UpdateStaffProfileAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateStaffProfileRequest;
use App\Models\StaffProfile;
use Illuminate\Http\RedirectResponse;

final class UpdateStaffProfileController extends Controller
{
    public function __invoke(
        UpdateStaffProfileRequest $request,
        StaffProfile $staffProfile,
        UpdateStaffProfileAction $updateStaffProfile,
        CreateMediaAction $createMedia
    ): RedirectResponse {
        $validated = $request->validated();

        if ($request->hasFile('avatar_file')) {
            $media = $createMedia($request->user(), $request->file('avatar_file'));
            $validated['avatar_id'] = $media->id;
        }

        $profile = $updateStaffProfile($staffProfile, $validated);

        flash('Đã cập nhật hồ sơ cán bộ.');

        return to_route('cms.staff-profiles.show', $profile);
    }
}
