<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\PostCategory\UpdatePostCategoryAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePostCategoryRequest;
use App\Models\PostCategory;
use Illuminate\Http\RedirectResponse;

final class UpdatePostCategoryController extends Controller
{
    public function __invoke(UpdatePostCategoryRequest $request, PostCategory $postCategory, UpdatePostCategoryAction $updateAction): RedirectResponse
    {
        /** @var array{
         *     name: string,
         *     slug: string,
         *     description?: string|null,
         *     parent_id?: int|null,
         *     sort_order: int,
         *     is_active: bool,
         *     site_layout_id?: int|null
         * } $validated
         */
        $validated = $request->validated();

        $updateAction($postCategory, $validated);

        flash('Đã cập nhật danh mục bài viết.');

        return to_route('cms.post-categories');
    }
}
