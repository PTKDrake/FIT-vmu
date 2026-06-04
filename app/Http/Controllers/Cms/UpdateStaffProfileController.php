<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Media\CreateMediaAction;
use App\Actions\StaffProfile\UpdateStaffProfileAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateStaffProfileRequest;
use App\Models\StaffProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;

final class UpdateStaffProfileController extends Controller
{
    public function __invoke(
        UpdateStaffProfileRequest $request,
        StaffProfile $staffProfile,
        UpdateStaffProfileAction $updateStaffProfile,
        CreateMediaAction $createMedia
    ): RedirectResponse {
        /** @var array{
         *     academic_title?: string|null,
         *     full_name: string,
         *     slug: string,
         *     avatar_id?: int|null,
         *     avatar_file?: UploadedFile|null,
         *     email?: string|null,
         *     phone?: string|null,
         *     bio?: string|null,
         *     bio_format?: string,
         *     is_public?: bool,
         *     appointments?: array<int, array{
         *         id?: int|null,
         *         unit_id: int,
         *         position_id: int,
         *         start_date: string,
         *         end_date?: string|null,
         *         note?: string|null
         *     }>|null
         * } $validated
         */
        $validated = $request->validated();
        $actor = $request->user();

        abort_unless($actor instanceof User, 403);

        if ($request->hasFile('avatar_file')) {
            $media = $createMedia($actor, $request->file('avatar_file'));
            $validated['avatar_id'] = $media->id;
        }

        /** @var array{
         *     academic_title?: string|null,
         *     full_name: string,
         *     slug: string,
         *     avatar_id?: int|null,
         *     email?: string|null,
         *     phone?: string|null,
         *     bio?: string|null,
         *     bio_format?: string,
         *     is_public?: bool,
         *     appointments?: array<int, array{
         *         id?: int|null,
         *         unit_id: int,
         *         position_id: int,
         *         start_date: string,
         *         end_date?: string|null,
         *         note?: string|null
         *     }>
         * } $payload
         */
        $payload = [
            'academic_title' => $validated['academic_title'] ?? null,
            'full_name' => $validated['full_name'],
            'slug' => $validated['slug'],
            'avatar_id' => $validated['avatar_id'] ?? null,
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'bio_format' => $validated['bio_format'] ?? 'blocknote_json',
            'is_public' => $validated['is_public'] ?? false,
            'appointments' => $validated['appointments'] ?? null,
        ];

        $profile = $updateStaffProfile($staffProfile, $payload);

        flash('Đã cập nhật hồ sơ cán bộ.');

        return to_route('cms.staff-profiles.show', $profile);
    }
}
