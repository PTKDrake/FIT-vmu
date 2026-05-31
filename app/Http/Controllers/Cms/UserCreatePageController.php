<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use Inertia\Response;
use Spatie\Permission\Models\Role;

final class UserCreatePageController extends Controller
{
    public function __invoke(): Response
    {
        $roleOptions = Role::query()
            ->select(['name'])
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role): array => [
                'value' => $role->name,
                'label' => $role->name,
            ])
            ->all();

        return inertia('cms/users/create', [
            'roleOptions' => $roleOptions,
        ]);
    }
}
