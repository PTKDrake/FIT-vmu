<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\Request;
use Inertia\Response;

final class PostEditPageController extends Controller
{
    public function __invoke(Request $request, Post $post): Response
    {
        $post->load('categories', 'thumbnail');

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
                'thumbnail_id' => $post->thumbnail_id,
                'thumbnail_url' => $post->thumbnail?->preview_url,
                'status' => $post->status,
            ],
            'categories' => $categories,
        ]);
    }
}
