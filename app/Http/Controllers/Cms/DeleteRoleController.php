<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

final class DeleteRoleController extends Controller
{
    /**
     * @var list<string>
     */
    private const PROTECTED_ROLE_NAMES = ['super-admin'];

    public function __invoke(Request $request, Role $role): RedirectResponse
    {
        $actor = $request->user();

        abort_unless($actor instanceof User, 403);

        // Ensure user is authorized to delete (manage roles policy)
        abort_unless($actor->can('update', $role), 403);

        // Block deleting protected system roles
        if (in_array($role->name, self::PROTECTED_ROLE_NAMES, true)) {
            abort(403, 'Không thể xóa vai trò hệ thống.');
        }

        $role->delete();

        // Flush Spatie permission cache
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        flash('Đã xóa vai trò.');

        return to_route('cms.roles-permissions');
    }
}
