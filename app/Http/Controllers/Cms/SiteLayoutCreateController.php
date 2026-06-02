<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use Inertia\Response;

final class SiteLayoutCreateController extends Controller
{
    public function __invoke(): Response
    {
        return inertia('cms/layouts/create');
    }
}
