<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Page\DeletePageAction;
use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;

final class DeletePageController extends Controller
{
    public function __invoke(Page $page, DeletePageAction $deletePage): RedirectResponse
    {
        $deletePage($page);

        return to_route('cms.pages');
    }
}
