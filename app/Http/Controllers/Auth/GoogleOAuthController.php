<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleOAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        if (! $this->googleLoginIsConfigured()) {
            flash('Google login is not configured yet.', type: 'warning');

            return to_route('login');
        }

        return Socialite::driver('google')
            ->scopes(['openid', 'profile', 'email'])
            ->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        if (! $this->googleLoginIsConfigured()) {
            flash('Google login is not configured yet.', type: 'warning');

            return to_route('login');
        }

        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (Throwable) {
            flash('Google authentication could not be completed. Please try again.', type: 'error');

            return to_route('login');
        }

        $email = $googleUser->getEmail();

        if (! is_string($email) || $email === '') {
            flash('Your Google account did not provide a usable email address.', type: 'error');

            return to_route('login');
        }

        $user = User::query()->firstWhere('email', $email);
        $wasRecentlyCreated = false;

        if (! $user instanceof User) {
            $user = User::query()->create([
                'name' => $googleUser->getName() ?: Str::before($email, '@'),
                'email' => $email,
                'email_verified_at' => now(),
                'password' => Hash::make(Str::password(32)),
            ]);

            event(new Registered($user));

            $wasRecentlyCreated = true;
        }

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        flash(
            $wasRecentlyCreated
                ? 'Your account has been created with Google.'
                : 'Welcome back!',
        );

        return $this->redirectToAuthenticatedDestination($user);
    }

    private function googleLoginIsConfigured(): bool
    {
        return filled(config('services.google.client_id'))
            && filled(config('services.google.client_secret'))
            && filled(config('services.google.redirect'));
    }
}
