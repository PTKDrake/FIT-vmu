<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Post\UpdatePostAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;

final class UpdatePostController extends Controller
{
    public function __invoke(UpdatePostRequest $request, Post $post, UpdatePostAction $updateAction): RedirectResponse
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
         *     site_layout_id?: int|null,
         *     status: string
         * } $validated
         */
        $validated = $request->validated();

        /** @var int $userId */
        $userId = $request->user()?->getKey();

        $updateAction($post, $validated, $userId);

        flash('Đã cập nhật bài viết.');

        return to_route('cms.posts');
    }
}
