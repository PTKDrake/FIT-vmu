<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\CarbonInterface;
use Inertia\Response;
use Spatie\Permission\Models\Role;

final class UserEditPageController extends Controller
{
    public function __invoke(User $user): Response
    {
        $roleNames = $user->getRoleNames()->sort()->values()->all();
        $isVerified = $user->email_verified_at !== null;

        $mappedUser = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $roleNames,
            'status' => $isVerified ? 'verified' : 'unverified',
            'isVerified' => $isVerified,
            'emailVerifiedAt' => $this->formatDateTime($user->email_verified_at),
            'createdAt' => $this->formatDateTime($user->created_at),
            'updatedAt' => $this->formatDateTime($user->updated_at),
        ];

        $roleOptions = Role::query()
            ->select(['name'])
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role): array => [
                'value' => $role->name,
                'label' => $role->name,
            ])
            ->all();

        return inertia('cms/users/edit', [
            'user' => $mappedUser,
            'roleOptions' => $roleOptions,
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
