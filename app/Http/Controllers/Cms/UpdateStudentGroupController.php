<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\StudentGroup\UpdateStudentGroupAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateStudentGroupRequest;
use App\Models\StudentGroup;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class UpdateStudentGroupController extends Controller
{
    public function __invoke(UpdateStudentGroupRequest $request, StudentGroup $student_group, UpdateStudentGroupAction $updateStudentGroup): RedirectResponse
    {
        /** @var array{
         *     name: string,
         *     code: string,
         *     scope: 'global'|'private',
         *     student_codes: list<string>
         * } $validated
         */
        $validated = $request->validated();
        $user = $request->user();
        assert($user instanceof User);

        $updateStudentGroup($student_group, $user, $validated);

        flash('Đã cập nhật nhóm sinh viên.');

        if ($request->boolean('redirect_back')) {
            return back();
        }

        return to_route('cms.student-groups');
    }
}
