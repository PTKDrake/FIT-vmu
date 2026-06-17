<?php

declare(strict_types=1);

namespace App\Actions\PublicSite;

use App\Actions\Puck\BuildPuckDynamicDataAction;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\SiteSetting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

final class BuildPublicPostPropsAction
{
    public function __construct(
        private readonly BuildPuckDynamicDataAction $buildPuckDynamicData,
    ) {}

    /**
     * @return array{
     *     post: array<string, mixed>,
     *     breadcrumbs: list<array{label: string, url: ?string}>,
     *     relatedPosts: list<array<string, mixed>>,
     *     layout: array<string, mixed>|null,
     *     dynamicData: array<string, mixed>
     * }
     */
    public function __invoke(Post $post, PostCategory $category, ?User $viewer = null): array
    {
        $post->loadMissing(['siteLayout', 'author', 'categories', 'thumbnail']);
        $layout = PublicLayoutResolver::resolve($post->siteLayout, SiteSetting::defaultPostLayoutId());

        return [
            'post' => $this->postToArray($post, $category),
            'breadcrumbs' => $this->buildBreadcrumbs($post, $category),
            'relatedPosts' => $this->buildRelatedPosts($post, $category, $viewer),
            'layout' => $layout,
            'dynamicData' => ($this->buildPuckDynamicData)(
                $viewer,
                true,
                $this->puckPayloads($post->content, $layout),
            ),
        ];
    }

    /**
     * @param  array<string, mixed>|null  $layout
     * @return list<mixed>
     */
    private function puckPayloads(?string $content, ?array $layout): array
    {
        return array_values(array_filter([
            $content,
            $layout['headerData'] ?? null,
            $layout['footerData'] ?? null,
            $layout['leftData'] ?? null,
            $layout['rightData'] ?? null,
        ]));
    }

    /**
     * @return array<string, mixed>
     */
    private function postToArray(Post $post, PostCategory $category): array
    {
        $categories = array_values($post->categories
            ->map(fn (PostCategory $category): array => [
                'name' => $category->name,
                'url' => '/'.$category->slug,
            ])
            ->all());

        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'url' => '/'.$category->slug.'/'.$post->slug,
            'excerpt' => $post->excerpt,
            'content' => $post->content,
            'contentFormat' => $post->content_format,
            'date' => $post->published_at !== null ? Carbon::parse($post->published_at)->format('d/m/Y') : null,
            'author' => $post->author?->name,
            'thumbnailUrl' => $post->thumbnail?->preview_url,
            'categories' => $categories,
        ];
    }

    /**
     * @return list<array{label: string, url: ?string}>
     */
    private function buildBreadcrumbs(Post $post, PostCategory $category): array
    {
        $crumbs = [['label' => 'Trang chủ', 'url' => '/']];

        if ($category->parent_id !== null) {
            $category->loadMissing('parent');
            if ($category->parent instanceof PostCategory) {
                $crumbs[] = [
                    'label' => $category->parent->name,
                    'url' => '/'.$category->parent->slug,
                ];
            }
        }

        $crumbs[] = ['label' => $category->name, 'url' => '/'.$category->slug];
        $crumbs[] = ['label' => $post->title, 'url' => null];

        return $crumbs;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function buildRelatedPosts(Post $post, PostCategory $category, ?User $viewer): array
    {
        $related = Post::query()
            ->with(['author', 'categories', 'thumbnail'])
            ->where('id', '!=', $post->id)
            ->where('status', 'published')
            ->whereHas('categories', fn ($q) => $q->where('post_categories.id', $category->id))
            ->latest('published_at')
            ->limit(3)
            ->get();

        if ($viewer instanceof User) {
            $studentCode = $viewer->student?->student_code;
            $related = $related->filter(function (Post $candidate) use ($studentCode): bool {
                $visibility = (string) ($candidate->visibility ?? 'public');

                return match ($visibility) {
                    'public' => true,
                    'authenticated' => true,
                    'students' => $studentCode !== null && trim($studentCode) !== '',
                    default => false,
                };
            })->values();
        } else {
            $related = $related->where('visibility', 'public')->values();
        }

        /** @var Collection<int, Post> $related */
        return array_values($related
            ->map(fn (Post $candidate): array => [
                'id' => $candidate->id,
                'title' => $candidate->title,
                'slug' => $candidate->slug,
                'url' => '/'.$category->slug.'/'.$candidate->slug,
                'excerpt' => $candidate->excerpt,
                'date' => $candidate->published_at !== null ? Carbon::parse($candidate->published_at)->format('d/m/Y') : null,
                'author' => $candidate->author?->name,
                'thumbnailUrl' => $candidate->thumbnail?->preview_url,
                'categoryNames' => array_values($candidate->categories->pluck('name')->all()),
            ])
            ->all());
    }
}
