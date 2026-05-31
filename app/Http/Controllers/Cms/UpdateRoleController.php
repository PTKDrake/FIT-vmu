<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Role\UpdateRoleAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateRoleRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Spatie\Permission\Models\Role;

final class UpdateRoleController extends Controller
{
    public function __invoke(UpdateRoleRequest $request, Role $role, UpdateRoleAction $updateRole): RedirectResponse
    {
        /** @var array{
         *     name: string,
         *     permissions?: list<string>
         * } $validated
         */
        $validated = $request->validated();
        $actor = $request->user();

        abort_unless($actor instanceof User, 403);

        $updateRole($actor, $role, $validated);

        flash('Đã cập nhật vai trò.');

        return to_route('cms.roles-permissions');
    }
}
