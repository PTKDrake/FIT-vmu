<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;

final class DeletePostController extends Controller
{
    public function __invoke(Post $post): RedirectResponse
    {
        $post->delete();

        flash('Đã xóa bài viết.');

        return to_route('cms.posts');
    }
}
