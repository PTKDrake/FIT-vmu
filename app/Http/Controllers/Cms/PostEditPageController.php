<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\StudentGroup\BuildAccessibleStudentGroupOptionsAction;
use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\SiteLayout;
use App\Models\SiteSetting;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Inertia\Response;

final class PostEditPageController extends Controller
{
    public function __invoke(Request $request, Post $post, BuildAccessibleStudentGroupOptionsAction $buildStudentGroupOptions): Response
    {
        $post->load('categories', 'thumbnail', 'reviewer', 'studentGroups');

        $categories = PostCategory::query()
            ->select(['id', 'name'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (PostCategory $cat): array => [
                'value' => (string) $cat->id,
                'label' => $cat->name,
            ])
            ->all();

        /** @var int $postId */
        $postId = $post->getKey();
        $reviewedAt = $post->getAttribute('reviewed_at');

        return inertia('cms/posts/edit', [
            'post' => [
                'id' => $postId,
                'title' => $post->title,
                'slug' => $post->slug,
                'category_ids' => array_values(
                    array_map(
                        static fn (int|string $categoryId): int => (int) $categoryId,
                        $post->categories->modelKeys(),
                    ),
                ),
                'excerpt' => $post->excerpt ?? '',
                'content' => $post->content ?? '',
                'content_format' => $post->content_format,
                'visibility' => $post->visibility,
                'student_group_ids' => $post->studentGroupIds(),
                'thumbnail_id' => $post->thumbnail_id,
                'thumbnail_url' => $post->thumbnail?->preview_url,
                'status' => $post->status,
                'rejection_reason' => $post->rejection_reason,
                'reviewed_at' => $reviewedAt instanceof CarbonInterface ? $reviewedAt->toAtomString() : null,
                'reviewer_name' => $post->reviewer?->name,
                'site_layout_id' => $post->site_layout_id,
            ],
            'categories' => $categories,
            'layoutOptions' => SiteLayout::query()
                ->orderBy('name')
                ->get(['id', 'name', 'key'])
                ->map(fn (SiteLayout $siteLayout): array => [
                    'id' => $siteLayout->id,
                    'name' => $siteLayout->name,
                    'key' => $siteLayout->key,
                ])
                ->values()
                ->all(),
            'defaultPostLayoutId' => SiteSetting::defaultPostLayoutId(),
            'studentGroupOptions' => $buildStudentGroupOptions($request->user()),
        ]);
    }
}
