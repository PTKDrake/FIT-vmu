<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\ProvisionStudentProfileFromEmailAction;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return inertia('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request, ProvisionStudentProfileFromEmailAction $provisionStudentProfile): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        /** @var array{name: string, email: string, password: string} $validated */
        $validated = $request->only('name', 'email', 'password');

        $user = DB::transaction(function () use ($validated, $provisionStudentProfile): User {
            $user = User::query()->create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            $provisionStudentProfile($user);

            return $user;
        });

        event(new Registered($user));

        Auth::login($user);

        flash(__('auth.registered'));

        return $this->redirectToAuthenticatedDestination($user);
    }
}
