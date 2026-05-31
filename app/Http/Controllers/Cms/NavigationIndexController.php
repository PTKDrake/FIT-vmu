<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Navigation\BuildNavigationEditorDataAction;
use App\Http\Controllers\Controller;
use Inertia\Response;

class NavigationIndexController extends Controller
{
    public function __invoke(BuildNavigationEditorDataAction $buildNavigationEditorData): Response
    {
        return inertia('cms/navigation/index', $buildNavigationEditorData());
    }
}
