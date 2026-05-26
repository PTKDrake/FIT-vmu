<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Dashboard\BuildDashboardOverviewAction;
use Illuminate\Http\Request;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
        BuildDashboardOverviewAction $buildDashboardOverviewAction,
    ): Response {
        return inertia('cms/dashboard', [
            'overview' => $buildDashboardOverviewAction(),
        ]);
    }
}
