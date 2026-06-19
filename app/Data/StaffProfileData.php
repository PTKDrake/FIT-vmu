<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Media;
use App\Models\StaffProfile;
use Carbon\CarbonInterface;
use Spatie\LaravelData\Lazy;

class StaffProfileData extends Data
{
    public function __construct(
        public int $userId,
        public ?string $academicTitle,
        public string $fullName,
        public string $slug,
        public string $bioFormat,
        public bool $isPublic,
        public ?string $email = null,
        public ?string $phone = null,
        public ?string $bio = null,
        public ?int $avatarId = null,
        public ?CarbonInterface $createdAt = null,
        public ?CarbonInterface $updatedAt = null,
        public ?int $id = null,
        public Lazy|MediaData|null $avatar = null,
    ) {}

    public static function fromModel(StaffProfile $staffProfile): self
    {
        $avatar = $staffProfile->relationLoaded('avatar') ? $staffProfile->avatar : null;

        return new self(
            userId: (int) $staffProfile->user_id,
            academicTitle: $staffProfile->academic_title,
            fullName: $staffProfile->full_name,
            slug: $staffProfile->slug,
            bioFormat: $staffProfile->bio_format,
            isPublic: $staffProfile->is_public,
            email: $staffProfile->email,
            phone: $staffProfile->phone,
            bio: $staffProfile->bio,
            avatarId: $staffProfile->avatar_id,
            createdAt: self::normalizeDateTime($staffProfile->created_at),
            updatedAt: self::normalizeDateTime($staffProfile->updated_at),
            id: $staffProfile->id,
            avatar: Lazy::whenLoaded(
                'avatar',
                $staffProfile,
                fn (): ?MediaData => $avatar instanceof Media ? MediaData::fromModel($avatar) : null,
            )->defaultIncluded(),
        );
    }
}
