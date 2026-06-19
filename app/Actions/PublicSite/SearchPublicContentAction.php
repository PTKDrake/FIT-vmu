<?php

declare(strict_types=1);

namespace App\Actions\PublicSite;

use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class SearchPublicContentAction
{
    private const ResultLimit = 5;

    /**
     * @return array{
     *     query: string,
     *     results: list<array{type: string, title: string, url: string, description: ?string}>
     * }
     */
    public function __invoke(string $query, ?User $viewer = null): array
    {
        $searchTerm = trim($query);

        if (mb_strlen($searchTerm) < 2) {
            return [
                'query' => $searchTerm,
                'results' => [],
            ];
        }

        return [
            'query' => $searchTerm,
            'results' => [
                ...$this->pages($searchTerm, $viewer),
                ...$this->posts($searchTerm, $viewer),
                ...$this->categories($searchTerm),
            ],
        ];
    }

    /** @return list<array{type: string, title: string, url: string, description: ?string}> */
    private function pages(string $searchTerm, ?User $viewer): array
    {
        return array_values(Page::query()
            ->whereNotNull('published_at')
            ->where(function (Builder $query) use ($searchTerm): void {
                $query
                    ->where('title', 'like', "%{$searchTerm}%")
                    ->orWhere('slug', 'like', "%{$searchTerm}%")
                    ->orWhere('excerpt', 'like', "%{$searchTerm}%");
            })
            ->latest('published_at')
            ->limit(self::ResultLimit * 5)
            ->get(['id', 'title', 'slug', 'excerpt', 'visibility'])
            ->filter(fn (Page $page): bool => $page->isVisibleTo($viewer))
            ->take(self::ResultLimit)
            ->map(fn (Page $page): array => [
                'type' => 'page',
                'title' => $page->title,
                'url' => "/{$page->slug}",
                'description' => $this->excerpt($page->excerpt),
            ])
            ->all());
    }

    /** @return list<array{type: string, title: string, url: string, description: ?string}> */
    private function posts(string $searchTerm, ?User $viewer): array
    {
        return array_values(Post::query()
            ->with('categories')
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->whereHas('categories', fn (Builder $query) => $query->where('is_active', true))
            ->where(function (Builder $query) use ($searchTerm): void {
                $query
                    ->where('title', 'like', "%{$searchTerm}%")
                    ->orWhere('slug', 'like', "%{$searchTerm}%")
                    ->orWhere('excerpt', 'like', "%{$searchTerm}%");
            })
            ->latest('published_at')
            ->limit(self::ResultLimit * 5)
            ->get(['id', 'title', 'slug', 'excerpt', 'visibility', 'status', 'published_at'])
            ->filter(fn (Post $post): bool => $post->isVisibleTo($viewer))
            ->filter(fn (Post $post): bool => $this->primaryCategory($post) instanceof PostCategory)
            ->take(self::ResultLimit)
            ->map(function (Post $post): array {
                /** @var PostCategory $category */
                $category = $this->primaryCategory($post);

                return [
                    'type' => 'post',
                    'title' => $post->title,
                    'url' => "/{$category->slug}/{$post->slug}",
                    'description' => $this->excerpt($post->excerpt),
                ];
            })
            ->all());
    }

    private function primaryCategory(Post $post): ?PostCategory
    {
        $category = $post->categories
            ->where('is_active', true)
            ->sortBy([
                ['sort_order', 'asc'],
                ['name', 'asc'],
            ])
            ->first();

        return $category instanceof PostCategory ? $category : null;
    }

    /** @return list<array{type: string, title: string, url: string, description: ?string}> */
    private function categories(string $searchTerm): array
    {
        return array_values(PostCategory::query()
            ->where('is_active', true)
            ->where(function (Builder $query) use ($searchTerm): void {
                $query
                    ->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('slug', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%");
            })
            ->withCount(['posts' => function (Builder $query): void {
                $query
                    ->where('status', 'published')
                    ->whereNotNull('published_at');
            }])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->limit(self::ResultLimit)
            ->get(['id', 'name', 'slug', 'description', 'sort_order', 'is_active'])
            ->map(fn (PostCategory $category): array => [
                'type' => 'category',
                'title' => $category->name,
                'url' => "/{$category->slug}",
                'description' => $this->categoryDescription($category),
            ])
            ->all());
    }

    private function excerpt(?string $value): ?string
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        return Str::limit(trim($value), 140);
    }

    private function categoryDescription(PostCategory $category): ?string
    {
        $description = $this->excerpt($category->description);

        if ($description !== null) {
            return $description;
        }

        $postsCount = (int) ($category->posts_count ?? 0);

        return $postsCount > 0 ? "{$postsCount} bài viết" : null;
    }
}
