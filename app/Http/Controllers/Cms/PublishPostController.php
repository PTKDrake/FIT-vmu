<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Post\PublishPostAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\PublishPostRequest;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;

final class PublishPostController extends Controller
{
    public function __invoke(PublishPostRequest $request, Post $post, PublishPostAction $publishAction): RedirectResponse
    {
        /** @var array{
         *     status: string,
         *     published_at?: string|null,
         *     rejection_reason?: string|null
         * } $validated
         */
        $validated = $request->validated();

        /** @var int $reviewerId */
        $reviewerId = $request->user()?->getKey();

        $publishAction($post, $validated, $reviewerId);

        flash($validated['status'] === 'published' ? 'Đã xuất bản bài viết.' : 'Đã từ chối duyệt bài viết.');

        return to_route('cms.posts');
    }
}
