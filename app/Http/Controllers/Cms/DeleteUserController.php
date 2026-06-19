<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\User\DeleteUserAction;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use RuntimeException;

final class DeleteUserController extends Controller
{
    public function __invoke(Request $request, User $user, DeleteUserAction $deleteUser): RedirectResponse
    {
        $actor = $request->user();

        abort_unless($actor instanceof User, 403);

        try {
            $deleteUser($actor, $user);
        } catch (AuthorizationException) {
            abort(403);
        } catch (RuntimeException $exception) {
            flash($exception->getMessage(), type: 'error');

            return to_route('cms.users');
        }

        flash('Đã xóa người dùng.');

        return to_route('cms.users');
    }
}
