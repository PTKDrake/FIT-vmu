<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\StudentGroup;
use Illuminate\Http\RedirectResponse;

class DeleteStudentGroupController extends Controller
{
    public function __invoke(StudentGroup $student_group): RedirectResponse
    {
        $student_group->delete();

        flash('Đã xóa nhóm sinh viên.');

        return to_route('cms.student-groups');
    }
}
