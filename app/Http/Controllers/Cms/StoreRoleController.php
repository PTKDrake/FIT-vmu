<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Role\CreateRoleAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

final class StoreRoleController extends Controller
{
    public function __invoke(StoreRoleRequest $request, CreateRoleAction $createRole): RedirectResponse
    {
        /** @var array{
         *     name: string,
         *     permissions?: list<string>
         * } $validated
         */
        $validated = $request->validated();
        $actor = $request->user();

        abort_unless($actor instanceof User, 403);

        $createRole($actor, $validated);

        flash('Đã tạo vai trò mới.');

        return to_route('cms.roles-permissions');
    }
}
