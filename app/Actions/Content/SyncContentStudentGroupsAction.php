<?php

declare(strict_types=1);

namespace App\Actions\Content;

use App\Models\Page;
use App\Models\Post;

class SyncContentStudentGroupsAction
{
    /**
     * @param  list<int|string>  $studentGroupIds
     */
    public function __invoke(Page|Post $content, array $studentGroupIds): void
    {
        $normalizedIds = collect($studentGroupIds)
            ->map(static fn (mixed $id): int => (int) $id)
            ->filter(static fn (int $id): bool => $id > 0)
            ->unique()
            ->sort()
            ->values()
            ->all();

        $content->studentGroups()->sync($normalizedIds);
    }
}
