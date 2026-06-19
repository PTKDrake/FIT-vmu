<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Events\CmsContentChanged;
use App\Http\Controllers\Controller;
use App\Models\PostCategory;
use Illuminate\Http\RedirectResponse;

final class DeletePostCategoryController extends Controller
{
    public function __invoke(PostCategory $postCategory): RedirectResponse
    {
        $postCategory->delete();

        event(CmsContentChanged::forResource(
            resource: 'post-categories',
            recordId: $postCategory->getKey(),
            title: $postCategory->name,
            status: $postCategory->is_active ? 'active' : 'inactive',
            action: 'deleted',
            message: 'Đã xóa danh mục bài viết.',
            updatedAt: $postCategory->updated_at,
        ));

        flash('Đã xóa danh mục bài viết.');

        return to_route('cms.post-categories');
    }
}
