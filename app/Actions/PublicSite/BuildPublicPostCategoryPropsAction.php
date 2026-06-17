<?php

declare(strict_types=1);

namespace App\Actions\PublicSite;

use App\Actions\Puck\BuildPuckDynamicDataAction;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\SiteSetting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

final class BuildPublicPostCategoryPropsAction
{
    public const int PER_PAGE = 12;

    public function __construct(
        private readonly BuildPuckDynamicDataAction $buildPuckDynamicData,
    ) {}

    /**
     * @return array{
     *     category: array{id: int, name: string, slug: string, description: ?string, parentId: ?int, children: list<array{id: int, name: string, slug: string, description: ?string}>},
     *     posts: array{data: list<array<string, mixed>>, current_page: int, last_page: int, next_page_url: ?string, prev_page_url: ?string, total: int},
     *     breadcrumbs: list<array{label: string, url: ?string}>,
     *     layout: array<string, mixed>|null,
     *     dynamicData: array<string, mixed>
     * }
     */
    public function __invoke(PostCategory $category, ?User $viewer = null): array
    {
        $category->loadMissing('siteLayout');

        if (! $category->relationLoaded('children')) {
            $category->setRelation(
                'children',
                $category->children()->where('is_active', true)->orderBy('sort_order')->orderBy('name')->get(),
            );
        }

        /** @var Collection<int, PostCategory> $children */
        $children = $category->children;

        $categoryIds = $this->resolveCategoryIdsForPosts($category, $children);

        $query = Post::query()
            ->with(['author', 'categories', 'thumbnail'])
            ->whereHas('categories', fn (Builder $q) => $q->whereIn('post_categories.id', $categoryIds))
            ->where('status', 'published')
            ->latest('published_at')
            ->latest();

        $this->applyVisibilityConstraints($query, $viewer);

        /** @var LengthAwarePaginator<array-key, Post> $paginator */
        $paginator = $query->paginate(self::PER_PAGE);

        $posts = array_values($paginator->getCollection()
            ->map(fn (Post $post): array => $this->postToArray($post))
            ->all());

        /** @var LengthAwarePaginator<array-key, mixed> $typedPaginator */
        $typedPaginator = $paginator;
        $layout = PublicLayoutResolver::resolve($category->siteLayout, SiteSetting::defaultCategoryLayoutId());

        return [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'parentId' => $category->parent_id,
                'children' => $this->childrenToArray($children),
            ],
            'posts' => [
                'data' => $posts,
                'current_page' => $typedPaginator->currentPage(),
                'last_page' => $typedPaginator->lastPage(),
                'next_page_url' => $typedPaginator->nextPageUrl(),
                'prev_page_url' => $typedPaginator->previousPageUrl(),
                'total' => $typedPaginator->total(),
            ],
            'breadcrumbs' => $this->buildBreadcrumbs($category),
            'layout' => $layout,
            'dynamicData' => ($this->buildPuckDynamicData)(
                $viewer,
                true,
                $this->puckPayloads($layout),
            ),
        ];
    }

    /**
     * @param  array<string, mixed>|null  $layout
     * @return list<mixed>
     */
    private function puckPayloads(?array $layout): array
    {
        return array_values(array_filter([
            $layout['headerData'] ?? null,
            $layout['footerData'] ?? null,
            $layout['leftData'] ?? null,
            $layout['rightData'] ?? null,
        ]));
    }

    /**
     * @param  Collection<int, PostCategory>  $children
     * @return list<int>
     */
    private function resolveCategoryIdsForPosts(PostCategory $category, Collection $children): array
    {
        $ids = [$category->id];

        if ($category->parent_id === null) {
            foreach ($children as $child) {
                $ids[] = $child->id;
            }
        }

        return array_values(array_unique($ids));
    }

    /**
     * @param  Collection<int, PostCategory>  $children
     * @return list<array{id: int, name: string, slug: string, description: ?string}>
     */
    private function childrenToArray(Collection $children): array
    {
        return array_values($children
            ->map(fn (PostCategory $child): array => [
                'id' => $child->id,
                'name' => $child->name,
                'slug' => $child->slug,
                'description' => $child->description,
            ])
            ->all());
    }

    /**
     * @return array{id: int, title: string, slug: string, url: ?string, excerpt: ?string, date: ?string, author: ?string, thumbnailUrl: ?string, categoryNames: list<string>}
     */
    private function postToArray(Post $post): array
    {
        $primaryCategory = $post->categories
            ->where('is_active', true)
            ->sortBy('sort_order')
            ->first();

        $categoryNames = array_values(
            $post->categories
                ->map(static fn (PostCategory $category): string => $category->name)
                ->filter(static fn (string $name): bool => $name !== '')
                ->all(),
        );

        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'url' => $primaryCategory instanceof PostCategory ? '/'.$primaryCategory->slug.'/'.$post->slug : null,
            'excerpt' => $post->excerpt,
            'date' => $post->published_at !== null ? Carbon::parse($post->published_at)->format('d/m/Y') : null,
            'author' => $post->author?->name,
            'thumbnailUrl' => $post->thumbnail?->preview_url,
            'categoryNames' => $categoryNames,
        ];
    }

    /**
     * @return list<array{label: string, url: ?string}>
     */
    private function buildBreadcrumbs(PostCategory $category): array
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

        $crumbs[] = ['label' => $category->name, 'url' => null];

        return $crumbs;
    }

    /**
     * @param  Builder<Post>  $query
     */
    private function applyVisibilityConstraints(Builder $query, ?User $viewer): void
    {
        if (! $viewer instanceof User) {
            $query->where('visibility', 'public');

            return;
        }

        $studentCode = $viewer->student?->student_code;
        $qualifiedIdColumn = $query->getModel()->qualifyColumn('id');

        $query->where(function (Builder $visibilityQuery) use ($qualifiedIdColumn, $studentCode): void {
            $visibilityQuery->whereIn('visibility', ['public', 'authenticated']);

            if ($studentCode !== null && trim($studentCode) !== '') {
                $visibilityQuery
                    ->orWhere('visibility', 'students')
                    ->orWhere(function (Builder $allowlistQuery) use ($qualifiedIdColumn, $studentCode): void {
                        $allowlistQuery
                            ->where('visibility', 'student_groups')
                            ->whereExists(function (QueryBuilder $existsQuery) use ($qualifiedIdColumn, $studentCode): void {
                                $existsQuery
                                    ->selectRaw('1')
                                    ->from('content_student_group_access')
                                    ->join(
                                        'student_group_members',
                                        'student_group_members.student_group_id',
                                        '=',
                                        'content_student_group_access.student_group_id',
                                    )
                                    ->whereColumn('content_student_group_access.accessible_id', $qualifiedIdColumn)
                                    ->where('content_student_group_access.accessible_type', Post::class)
                                    ->where('student_group_members.student_code', trim($studentCode));
                            });
                    });
            }
        });
    }
}
