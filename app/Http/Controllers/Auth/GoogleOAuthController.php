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
use Laravel\Socialite\Two\GoogleProvider;
use Throwable;

class GoogleOAuthController extends Controller
{
    private const AllowedHostedDomain = 'st.vimaru.edu.vn';

    public function redirect(): RedirectResponse
    {
        if (! $this->googleLoginIsConfigured()) {
            flash(__('auth.google_not_configured'), type: 'warning');

            return to_route('login');
        }

        /** @var GoogleProvider $provider */
        $provider = Socialite::driver('google');

        return $provider
            ->scopes(['openid', 'profile', 'email'])
            ->with([
                'hd' => self::AllowedHostedDomain,
                'prompt' => 'select_account',
            ])
            ->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        if (! $this->googleLoginIsConfigured()) {
            flash(__('auth.google_not_configured'), type: 'warning');

            return to_route('login');
        }

        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (Throwable) {
            flash(__('auth.google_auth_failed'), type: 'error');

            return to_route('login');
        }

        $email = $googleUser->getEmail();

        if (! is_string($email) || $email === '') {
            flash(__('auth.google_missing_email'), type: 'error');

            return to_route('login');
        }

        if (! $this->emailUsesAllowedHostedDomain($email)) {
            flash(__('auth.google_invalid_domain', ['domain' => self::AllowedHostedDomain]), type: 'error');

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
                ? __('auth.google_account_created')
                : __('auth.welcome_back'),
        );

        return $this->redirectToAuthenticatedDestination($user);
    }

    private function googleLoginIsConfigured(): bool
    {
        return filled(config('services.google.client_id'))
            && filled(config('services.google.client_secret'))
            && filled(config('services.google.redirect'));
    }

    private function emailUsesAllowedHostedDomain(string $email): bool
    {
        return str_ends_with(Str::lower($email), '@'.self::AllowedHostedDomain);
    }
}
