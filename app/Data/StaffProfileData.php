<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\StaffProfile;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;

class StaffProfileData extends Data
{
    public function __construct(
        public ?int $id,
        public ?int $userId,
        public string $fullName,
        public ?string $slug,
        public ?int $avatarId,
        public ?string $email,
        public ?string $phone,
        public ?string $bio,
        public string $bioFormat,
        public bool $isPublic,
        public int $sortOrder,
        public ?CarbonImmutable $createdAt,
        public ?CarbonImmutable $updatedAt,
    ) {}

    public static function fromModel(StaffProfile $staffProfile): self
    {
        return new self(
            id: $staffProfile->id,
            userId: $staffProfile->user_id,
            fullName: $staffProfile->full_name,
            slug: $staffProfile->slug,
            avatarId: $staffProfile->avatar_id,
            email: $staffProfile->email,
            phone: $staffProfile->phone,
            bio: $staffProfile->bio,
            bioFormat: $staffProfile->bio_format,
            isPublic: $staffProfile->is_public,
            sortOrder: $staffProfile->sort_order,
            createdAt: $staffProfile->created_at?->toImmutable(),
            updatedAt: $staffProfile->updated_at?->toImmutable(),
        );
    }
}
