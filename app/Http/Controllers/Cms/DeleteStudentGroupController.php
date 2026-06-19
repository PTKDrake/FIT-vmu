<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Events\CmsContentChanged;
use App\Http\Controllers\Controller;
use App\Models\StudentGroup;
use Illuminate\Http\RedirectResponse;

class DeleteStudentGroupController extends Controller
{
    public function __invoke(StudentGroup $student_group): RedirectResponse
    {
        $student_group->delete();

        event(CmsContentChanged::forResource(
            resource: 'student-groups',
            recordId: $student_group->getKey(),
            title: $student_group->name,
            status: $student_group->isGlobal() ? 'global' : 'private',
            action: 'deleted',
            message: 'Đã xóa nhóm sinh viên.',
            updatedAt: $student_group->updated_at,
        ));

        flash('Đã xóa nhóm sinh viên.');

        return to_route('cms.student-groups');
    }
}
