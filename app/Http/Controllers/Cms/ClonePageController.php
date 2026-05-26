<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Page\ClonePageAction;
use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class ClonePageController extends Controller
{
    public function __invoke(Request $request, Page $page, ClonePageAction $clonePage): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user instanceof User, 403);

        $clonePage($page, $user);

        return to_route('cms.pages');
    }
}
