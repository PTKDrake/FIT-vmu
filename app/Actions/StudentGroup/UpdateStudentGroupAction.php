<?php

declare(strict_types=1);

namespace App\Actions\StudentGroup;

use App\Events\CmsContentChanged;
use App\Models\StudentGroup;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UpdateStudentGroupAction
{
    public function __construct(
        private readonly SyncStudentGroupMembersAction $syncStudentGroupMembers,
    ) {}

    /**
     * @param  array{
     *     name: string,
     *     code: string,
     *     scope: 'global'|'private',
     *     student_codes: list<string>
     * }  $attributes
     */
    public function __invoke(StudentGroup $studentGroup, User $user, array $attributes): StudentGroup
    {
        return DB::transaction(function () use ($studentGroup, $user, $attributes): StudentGroup {
            $studentGroup->update([
                'name' => $attributes['name'],
                'code' => $attributes['code'],
                'owner_id' => $attributes['scope'] === 'global' ? null : $user->getKey(),
            ]);

            ($this->syncStudentGroupMembers)($studentGroup, $attributes['student_codes']);

            event(CmsContentChanged::forResource(
                resource: 'student-groups',
                recordId: $studentGroup->getKey(),
                title: $studentGroup->name,
                status: $studentGroup->isGlobal() ? 'global' : 'private',
                action: 'updated',
                message: 'Đã cập nhật nhóm sinh viên.',
                updatedAt: $studentGroup->updated_at,
            ));

            return $studentGroup->fresh(['owner', 'members']) ?? $studentGroup;
        });
    }
}
