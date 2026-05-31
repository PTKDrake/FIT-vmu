<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\PostCategory;
use Illuminate\Http\RedirectResponse;

final class DeletePostCategoryController extends Controller
{
    public function __invoke(PostCategory $postCategory): RedirectResponse
    {
        $postCategory->delete();

        flash('Đã xóa danh mục bài viết.');

        return to_route('cms.post-categories');
    }
}
