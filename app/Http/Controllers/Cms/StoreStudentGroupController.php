<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\StudentGroup\CreateStudentGroupAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentGroupRequest;
use App\Models\StudentGroup;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class StoreStudentGroupController extends Controller
{
    public function __invoke(StoreStudentGroupRequest $request, CreateStudentGroupAction $createStudentGroup): RedirectResponse|JsonResponse
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

        $studentGroup = $createStudentGroup($user, $validated);

        if ($request->expectsJson()) {
            return response()->json([
                'group' => $this->toGroupOption($studentGroup),
            ], 201);
        }

        flash('Đã tạo nhóm sinh viên.');

        if ($request->boolean('redirect_back')) {
            return back();
        }

        return to_route('cms.student-groups');
    }

    /**
     * @return array{
     *     value: string,
     *     label: string,
     *     code: string,
     *     scope: 'global'|'private'
     * }
     */
    private function toGroupOption(StudentGroup $studentGroup): array
    {
        $groupId = $studentGroup->id;

        return [
            'value' => (string) $groupId,
            'label' => $studentGroup->name,
            'code' => $studentGroup->code,
            'scope' => $studentGroup->isGlobal() ? 'global' : 'private',
        ];
    }
}
