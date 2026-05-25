<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\StaffProfile;
use Illuminate\Support\Carbon;
use Spatie\LaravelData\Lazy;

class StaffProfileData extends Data
{
    public function __construct(
        public int $userId,
        public string $fullName,
        public string $slug,
        public string $bioFormat,
        public bool $isPublic,
        public int $sortOrder,
        public ?string $email = null,
        public ?string $phone = null,
        public ?string $bio = null,
        public ?int $avatarId = null,
        public ?Carbon $createdAt = null,
        public ?Carbon $updatedAt = null,
        public ?int $id = null,
        public Lazy|MediaData|null $avatar = null,
    ) {}

    public static function fromModel(StaffProfile $staffProfile): self
    {
        return new self(
            userId: $staffProfile->user_id,
            fullName: $staffProfile->full_name,
            slug: $staffProfile->slug,
            bioFormat: $staffProfile->bio_format,
            isPublic: $staffProfile->is_public,
            sortOrder: $staffProfile->sort_order,
            email: $staffProfile->email,
            phone: $staffProfile->phone,
            bio: $staffProfile->bio,
            avatarId: $staffProfile->avatar_id,
            createdAt: $staffProfile->created_at,
            updatedAt: $staffProfile->updated_at,
            id: $staffProfile->id,
            avatar: Lazy::whenLoaded(
                'avatar',
                $staffProfile,
                fn (): ?MediaData => $staffProfile->avatar ? MediaData::fromModel($staffProfile->avatar) : null,
            )->defaultIncluded(),
        );
    }
}
