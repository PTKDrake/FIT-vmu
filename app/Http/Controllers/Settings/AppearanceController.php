<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Inertia\Response;

class AppearanceController extends Controller
{
    public function __invoke(): Response
    {
        return inertia('settings/appearance');
    }
}
