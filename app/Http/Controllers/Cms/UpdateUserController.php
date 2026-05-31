<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\User\UpdateUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

final class UpdateUserController extends Controller
{
    public function __invoke(UpdateUserRequest $request, User $user, UpdateUserAction $updateUser): RedirectResponse
    {
        /** @var array{
         *     name: string,
         *     email: string,
         *     password?: string|null,
         *     email_verified: bool,
         *     roles?: list<string>
         * } $validated
         */
        $validated = $request->validated();
        $actor = $request->user();

        abort_unless($actor instanceof User, 403);

        $updateUser($actor, $user, $validated);

        flash('Đã cập nhật người dùng.');

        return to_route('cms.users');
    }
}
