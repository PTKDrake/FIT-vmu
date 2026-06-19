<?php

declare(strict_types=1);

namespace App\Actions\Settings;

use App\Actions\Media\CreateMediaAction;
use App\Actions\StaffProfile\UpdateStaffProfileAction;
use App\Models\User;
use Illuminate\Http\UploadedFile;

class UpdateUserProfileAction
{
    public function __construct(
        private readonly UpdateStaffProfileAction $updateStaffProfile,
        private readonly CreateMediaAction $createMedia,
    ) {}

    /**
     * @param  array{
     *     name: string,
     *     email: string,
     *     academic_title?: string|null,
     *     full_name?: string,
     *     slug?: string,
     *     staff_email?: string|null,
     *     phone?: string|null,
     *     bio?: string|null,
     *     is_public?: bool|string|int,
     *     avatar_file?: UploadedFile|null
     * }  $attributes
     */
    public function __invoke(User $user, array $attributes): void
    {
        $user->fill([
            'name' => $attributes['name'],
            'email' => $attributes['email'],
        ]);

        if ($user->isDirty('email')) {
            $user->forceFill([
                'email_verified_at' => null,
            ]);
        }

        $user->save();

        $staffProfile = $user->staffProfile;
        if ($staffProfile && isset($attributes['full_name']) && isset($attributes['slug'])) {
            $avatarId = $staffProfile->avatar_id;

            if (isset($attributes['avatar_file'])) {
                $media = ($this->createMedia)($user, $attributes['avatar_file']);
                $avatarId = $media->id;
            }

            ($this->updateStaffProfile)($staffProfile, [
                'academic_title' => $attributes['academic_title'] ?? null,
                'full_name' => $attributes['full_name'],
                'slug' => $attributes['slug'],
                'email' => $attributes['staff_email'] ?? null,
                'phone' => $attributes['phone'] ?? null,
                'bio' => $attributes['bio'] ?? null,
                'bio_format' => 'blocknote_json',
                'is_public' => filter_var($attributes['is_public'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'avatar_id' => $avatarId,
            ]);
        }
    }
}
