<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;

abstract class Controller
{
    protected function redirectToAuthenticatedDestination(User $user): RedirectResponse
    {
        $intendedRoute = $user->can('view admin dashboard')
            ? route('dashboard', absolute: false)
            : route('home', absolute: false);

        return redirect()->intended($intendedRoute);
    }
}
