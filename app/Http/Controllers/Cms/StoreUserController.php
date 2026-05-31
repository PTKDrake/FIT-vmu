<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\User\CreateUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

final class StoreUserController extends Controller
{
    public function __invoke(StoreUserRequest $request, CreateUserAction $createUser): RedirectResponse
    {
        /** @var array{
         *     name: string,
         *     email: string,
         *     password: string,
         *     email_verified: bool,
         *     roles?: list<string>
         * } $validated
         */
        $validated = $request->validated();
        $actor = $request->user();

        abort_unless($actor instanceof User, 403);

        $createUser($actor, $validated);

        flash('Đã tạo người dùng mới.');

        return to_route('cms.users');
    }
}
