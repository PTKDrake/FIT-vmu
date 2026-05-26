<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use App\Actions\Settings\UpdateUserProfileAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return inertia('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(
        ProfileUpdateRequest $request,
        UpdateUserProfileAction $updateUserProfileAction,
    ): RedirectResponse {
        $user = $request->user();
        assert($user instanceof User);

        /** @var array{name: string, email: string} $attributes */
        $attributes = $request->validated();

        $updateUserProfileAction($user, $attributes);

        return to_route('profile.edit');
    }
}
