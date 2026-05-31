<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\PostCategory\CreatePostCategoryAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostCategoryRequest;
use Illuminate\Http\RedirectResponse;

final class StorePostCategoryController extends Controller
{
    public function __invoke(StorePostCategoryRequest $request, CreatePostCategoryAction $createAction): RedirectResponse
    {
        /** @var array{
         *     name: string,
         *     slug: string,
         *     description?: string|null,
         *     parent_id?: int|null,
         *     sort_order: int,
         *     is_active: bool
         * } $validated
         */
        $validated = $request->validated();

        $createAction($validated);

        flash('Đã tạo danh mục bài viết mới.');

        return to_route('cms.post-categories');
    }
}
