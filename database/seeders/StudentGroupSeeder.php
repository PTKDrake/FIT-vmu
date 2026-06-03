<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Actions\StudentGroup\SyncStudentGroupMembersAction;
use App\Models\StudentGroup;
use App\Models\User;
use Illuminate\Database\Seeder;

class StudentGroupSeeder extends Seeder
{
    /**
     * @var list<array{
     *     name: string,
     *     code: string,
     *     scope: 'global'|'private',
     *     student_codes: list<string>
     * }>
     */
    private const GROUPS = [
        [
            'name' => 'Tân sinh viên TTM63DH',
            'code' => 'TTM63DH',
            'scope' => 'global',
            'student_codes' => ['63001', '63002', '63003', '63004'],
        ],
        [
            'name' => 'Nhóm kiểm thử nội dung sinh viên',
            'code' => 'FITSTUDENTQA',
            'scope' => 'global',
            'student_codes' => ['94903', '123456', '123457'],
        ],
        [
            'name' => 'Sinh viên cố vấn riêng',
            'code' => 'PRIVATEADV',
            'scope' => 'private',
            'student_codes' => ['200001', '200002'],
        ],
    ];

    public function __construct(
        private readonly SyncStudentGroupMembersAction $syncStudentGroupMembers,
    ) {}

    public function run(): void
    {
        $owner = User::query()
            ->whereIn('email', ['admin@vimaru.edu.vn', 'super-admin@vimaru.edu.vn', 'content-seeder@vimaru.edu.vn'])
            ->first();

        foreach (self::GROUPS as $groupData) {
            $studentGroup = StudentGroup::query()->updateOrCreate(
                ['code' => $groupData['code']],
                [
                    'name' => $groupData['name'],
                    'owner_id' => $groupData['scope'] === 'global' ? null : $owner?->getKey(),
                ],
            );

            ($this->syncStudentGroupMembers)($studentGroup, $groupData['student_codes']);
        }
    }
}
