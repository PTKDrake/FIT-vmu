<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\PublicSite\BuildPublicPostPropsAction;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

final class PublicPostController extends Controller
{
    public function __invoke(
        Request $request,
        string $categorySlug,
        string $postSlug,
        BuildPublicPostPropsAction $buildProps,
    ): Response|RedirectResponse {
        $category = PostCategory::query()->where('slug', $categorySlug)->first();
        abort_unless($category instanceof PostCategory && $category->is_active === true, 404);

        $post = Post::query()->where('slug', $postSlug)->first();
        abort_unless($post instanceof Post && $post->status === 'published', 404);
        abort_unless($this->postBelongsToCategory($post, $category), 404);

        /** @var User|null $viewer */
        $viewer = $request->user();

        if (! $post->isVisibleTo($viewer)) {
            if (! $viewer instanceof User && $post->requiresAuthenticationForViewing()) {
                return to_route('login');
            }

            abort(403);
        }

        return inertia('public/post', $buildProps($post, $category, $viewer));
    }

    private function postBelongsToCategory(Post $post, PostCategory $category): bool
    {
        $post->loadMissing('categories');

        $ancestorIds = $this->resolveCategoryIdsForMatch($category);

        foreach ($post->categories as $postCategory) {
            if (in_array($postCategory->id, $ancestorIds, true)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return list<int>
     */
    private function resolveCategoryIdsForMatch(PostCategory $category): array
    {
        $ids = [$category->id];

        if ($category->parent_id === null) {
            $category->loadMissing('children');
            foreach ($category->children as $child) {
                $ids[] = $child->id;
            }
        }

        return array_values(array_unique($ids));
    }
}
