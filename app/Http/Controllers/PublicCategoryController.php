<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\PublicSite\BuildPublicCategoryDataAction;
use App\Actions\PublicSite\BuildPublicShellDataAction;
use App\Models\PostCategory;
use Inertia\Response;

final class PublicCategoryController extends Controller
{
    public function __invoke(
        PostCategory $postCategory,
        BuildPublicCategoryDataAction $buildPublicCategoryData,
        BuildPublicShellDataAction $buildPublicShellData,
    ): Response {
        abort_unless($postCategory->is_active, 404);

        return inertia('public/show', [
            'type' => 'category',
            'data' => $buildPublicCategoryData($postCategory),
            ...$buildPublicShellData(),
        ]);
    }
}
