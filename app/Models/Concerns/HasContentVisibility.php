<?php

declare(strict_types=1);

namespace App\Models\Concerns;

use App\Models\StudentGroup;
use App\Models\StudentGroupMember;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

trait HasContentVisibility
{
    /** @return MorphToMany<StudentGroup, $this> */
    public function studentGroups(): MorphToMany
    {
        return $this->morphToMany(StudentGroup::class, 'accessible', 'content_student_group_access');
    }

    /** @return list<int> */
    public function studentGroupIds(): array
    {
        if ($this->relationLoaded('studentGroups')) {
            /** @var list<int> $groupIds */
            $groupIds = $this->studentGroups
                ->pluck('id')
                ->filter(static fn (mixed $value): bool => is_int($value) || (is_string($value) && is_numeric($value)))
                ->map(static fn (int|string $value): int => (int) $value)
                ->filter(static fn (int $value): bool => $value > 0)
                ->values()
                ->all();

            return $groupIds;
        }

        /** @var list<int> $groupIds */
        $groupIds = $this->studentGroups()
            ->orderBy('student_groups.name')
            ->pluck('student_groups.id')
            ->filter(static fn (mixed $value): bool => is_int($value) || (is_string($value) && is_numeric($value)))
            ->map(static fn (int|string $value): int => (int) $value)
            ->filter(static fn (int $value): bool => $value > 0)
            ->values()
            ->all();

        return $groupIds;
    }

    public function isVisibleTo(?User $user): bool
    {
        return match ($this->getAttribute('visibility') ?? 'public') {
            'public' => true,
            'authenticated' => $user instanceof User,
            'students' => $this->studentCodeFor($user) !== null,
            'student_groups' => $this->isStudentGroupAllowed($this->studentCodeFor($user)),
            'hidden' => $user?->can('view admin dashboard') ?? false,
            default => false,
        };
    }

    public function requiresAuthenticationForViewing(): bool
    {
        return ($this->getAttribute('visibility') ?? 'public') !== 'public';
    }

    private function isStudentGroupAllowed(?string $studentCode): bool
    {
        if ($studentCode === null) {
            return false;
        }

        if ($this->relationLoaded('studentGroups')) {
            return $this->studentGroups->contains(function (StudentGroup $group) use ($studentCode): bool {
                if ($group->relationLoaded('members')) {
                    return $group->members->contains(
                        fn (StudentGroupMember $member): bool => $member->student_code === $studentCode,
                    );
                }

                return $group->members()->where('student_code', $studentCode)->exists();
            });
        }

        return $this->studentGroups()
            ->whereHas('members', fn ($query) => $query->where('student_code', $studentCode))
            ->exists();
    }

    private function studentCodeFor(?User $user): ?string
    {
        $studentCode = $user?->student?->student_code;

        if (! is_string($studentCode) || trim($studentCode) === '') {
            return null;
        }

        return trim($studentCode);
    }
}
