<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Media\CreateMediaAction;
use App\Actions\StaffProfile\CreateStaffProfileAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStaffProfileRequest;
use Illuminate\Http\RedirectResponse;

final class StoreStaffProfileController extends Controller
{
    public function __invoke(
        StoreStaffProfileRequest $request,
        CreateStaffProfileAction $createStaffProfile,
        CreateMediaAction $createMedia
    ): RedirectResponse {
        $validated = $request->validated();

        if ($request->hasFile('avatar_file')) {
            $media = $createMedia($request->user(), $request->file('avatar_file'));
            $validated['avatar_id'] = $media->id;
        }

        $profile = $createStaffProfile($validated);

        flash('Đã tạo hồ sơ cán bộ mới.');

        return to_route('cms.staff-profiles.show', $profile);
    }
}
