<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;

if (! app()->isProduction()) {
    Route::get('dev/login/{id}', function ($id = null) {
        $user = $id === null
            ? User::query()->firstOrFail()
            : User::query()->findOrFail($id);

        auth()->login($user);

        return redirect('/');
    });
}
