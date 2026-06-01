<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\PublicSite\BuildPublicPostDataAction;
use App\Actions\PublicSite\BuildPublicShellDataAction;
use App\Models\Post;
use Inertia\Response;

final class PublicPostController extends Controller
{
    public function __invoke(
        Post $post,
        BuildPublicPostDataAction $buildPublicPostData,
        BuildPublicShellDataAction $buildPublicShellData,
    ): Response {
        abort_unless($post->status === 'published', 404);

        return inertia('public/show', [
            'type' => 'post',
            'data' => $buildPublicPostData($post),
            ...$buildPublicShellData(),
        ]);
    }
}
