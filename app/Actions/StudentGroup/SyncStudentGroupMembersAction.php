<?php

declare(strict_types=1);

namespace App\Actions\StudentGroup;

use App\Models\StudentGroup;
use Illuminate\Support\Collection;

class SyncStudentGroupMembersAction
{
    /**
     * @param  list<string>  $studentCodes
     */
    public function __invoke(StudentGroup $studentGroup, array $studentCodes): void
    {
        /** @var Collection<int, string> $normalizedCodes */
        $normalizedCodes = collect($studentCodes)
            ->filter(static fn (string $code): bool => trim($code) !== '')
            ->map(static fn (string $code): string => strtoupper(trim($code)))
            ->unique()
            ->sort()
            ->values();

        /** @var Collection<int, string> $existingCodes */
        $existingCodes = $studentGroup->members()->pluck('student_code');

        $codesToDelete = $existingCodes->diff($normalizedCodes);

        if ($codesToDelete->isNotEmpty()) {
            $studentGroup->members()
                ->whereIn('student_code', $codesToDelete->all())
                ->delete();
        }

        $codesToCreate = $normalizedCodes->diff($existingCodes->all());

        if ($codesToCreate->isEmpty()) {
            return;
        }

        $studentGroup->members()->createMany(
            $codesToCreate
                ->map(static fn (string $code): array => ['student_code' => $code])
                ->all(),
        );
    }
}
