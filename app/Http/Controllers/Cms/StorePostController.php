<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Post\CreatePostAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use Illuminate\Http\RedirectResponse;

final class StorePostController extends Controller
{
    public function __invoke(StorePostRequest $request, CreatePostAction $createAction): RedirectResponse
    {
        /** @var array{
         *     title: string,
         *     slug: string,
         *     category_ids?: list<int>,
         *     excerpt?: string|null,
         *     content: string,
         *     content_format: string,
         *     visibility: string,
         *     student_group_ids?: list<int>,
         *     thumbnail_id?: int|null,
         *     status: string
         * } $validated
         */
        $validated = $request->validated();

        /** @var int $userId */
        $userId = $request->user()?->getKey();

        $createAction($validated, $userId);

        flash('Đã tạo bài viết mới.');

        return to_route('cms.posts');
    }
}
