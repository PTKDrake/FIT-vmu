<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use App\Actions\Settings\DeleteUserAccountAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class DeleteAccountController extends Controller
{
    public function index()
    {
        return inertia('settings/delete-account');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(
        ProfileDeleteRequest $request,
        DeleteUserAccountAction $deleteUserAccountAction,
    ): RedirectResponse {
        $user = $request->user();

        Auth::logout();

        $deleteUserAccountAction($user);

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        flash(
            __('Your account has been successfully deleted.'),
        );

        return redirect('/');
    }
}
