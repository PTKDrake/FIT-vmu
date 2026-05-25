<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Dashboard\BuildDashboardOverviewAction;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        Request $request,
        BuildDashboardOverviewAction $buildDashboardOverviewAction,
    ) {
        return inertia('cms/dashboard', [
            'overview' => $buildDashboardOverviewAction(),
        ]);
    }
}
