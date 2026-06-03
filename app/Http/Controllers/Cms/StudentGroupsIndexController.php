<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\StudentGroup;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Inertia\Response;

class StudentGroupsIndexController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        assert($user instanceof User);

        $groups = StudentGroup::query()
            ->visibleTo($user)
            ->with(['owner:id,name', 'members:id,student_group_id,student_code'])
            ->orderByRaw('owner_id is null desc')
            ->orderBy('name')
            ->get();

        return inertia('cms/student-groups/index', [
            'can' => [
                'createGroup' => $user->can('create', StudentGroup::class),
                'createGlobalGroup' => $user->can('createGlobal', StudentGroup::class),
            ],
            'groups' => $groups->map(function (StudentGroup $group) use ($user): array {
                return [
                    'id' => $group->getKey(),
                    'name' => $group->name,
                    'code' => $group->code,
                    'scope' => $group->isGlobal() ? 'global' : 'private',
                    'ownerName' => $group->owner?->name,
                    'studentCodes' => $group->members
                        ->pluck('student_code')
                        ->sort()
                        ->values()
                        ->all(),
                    'memberCount' => $group->members->count(),
                    'canUpdate' => $user->can('update', $group),
                    'canDelete' => $user->can('delete', $group),
                    'updatedAt' => $this->formatDateTime($group->updated_at) ?? now()->toAtomString(),
                ];
            })->values()->all(),
        ]);
    }

    private function formatDateTime(mixed $value): ?string
    {
        if ($value instanceof CarbonInterface) {
            return $value->toAtomString();
        }

        if (is_string($value) && $value !== '') {
            return $value;
        }

        return null;
    }
}
