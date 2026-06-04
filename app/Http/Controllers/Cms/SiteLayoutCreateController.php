<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Puck\BuildPuckDynamicDataAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;

final class SiteLayoutCreateController extends Controller
{
    public function __invoke(Request $request, BuildPuckDynamicDataAction $buildPuckDynamicData): Response
    {
        return inertia('cms/layouts/create', [
            'dynamicData' => $buildPuckDynamicData($request->user()),
        ]);
    }
}
