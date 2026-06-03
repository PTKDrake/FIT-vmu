<?php

declare(strict_types=1);

namespace App\Actions\StudentGroup;

use App\Models\StudentGroup;
use App\Models\User;

class BuildAccessibleStudentGroupOptionsAction
{
    /**
     * @return list<array{
     *     value: string,
     *     label: string,
     *     code: string,
     *     scope: 'global'|'private'
     * }>
     */
    public function __invoke(?User $user): array
    {
        if (! $user instanceof User) {
            return [];
        }

        return array_values(StudentGroup::query()
            ->visibleTo($user)
            ->orderByRaw('owner_id is null desc')
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'owner_id'])
            ->map(static function (StudentGroup $group): array {
                $groupId = $group->id;

                return [
                    'value' => (string) $groupId,
                    'label' => $group->name,
                    'code' => $group->code,
                    'scope' => $group->isGlobal() ? 'global' : 'private',
                ];
            })
            ->all());
    }
}
