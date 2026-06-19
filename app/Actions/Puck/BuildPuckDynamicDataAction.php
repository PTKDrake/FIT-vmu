<?php

declare(strict_types=1);

namespace App\Actions\Puck;

use App\Models\Media;
use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\StaffProfile;
use App\Models\Unit;
use App\Models\User;
use Carbon\CarbonInterface;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class BuildPuckDynamicDataAction
{
    public function __construct(
        private readonly ExtractPuckMediaIdsAction $extractPuckMediaIds,
    ) {}

    /**
     * @param  iterable<mixed>  $puckPayloads
     * @return array{
     *     navigationMenus: list<array{id: int, name: string, slug: string, location: ?string, items: list<array<string, mixed>>}>,
     *     posts: list<array{id: int, title: string, slug: string, url: ?string, excerpt: ?string, date: ?string, author: ?string, thumbnailUrl: ?string, categoryIds: list<int>, categoryNames: list<string>}>,
     *     categories: list<array{id: int, name: string, slug: string, parentId: ?int, description: ?string}>,
     *     staff: list<array{id: int, name: string, fullName: string, academicTitle: ?string, slug: string, email: ?string, phone: ?string, avatarUrl: ?string, position: ?string, unitIds: list<int>, expertise: ?string}>,
     *     units: list<array{id: int, name: string, slug: string, description: ?string, head: ?string}>,
     *     pages: list<array{id: int, title: string, slug: string, url: string}>,
     *     media: array<int, array{id: int, displayName: string, previewUrl: string, mimeType: string}>
     * }
     */
    public function __invoke(?User $viewer = null, bool $enforceVisibility = false, iterable $puckPayloads = []): array
    {
        $units = $this->units();

        return [
            'navigationMenus' => $this->navigationMenus($units),
            'posts' => $this->posts($viewer, $enforceVisibility),
            'categories' => $this->categories(),
            'staff' => $this->staff(),
            'units' => $units,
            'pages' => $this->pages($viewer, $enforceVisibility),
            'media' => $this->media($puckPayloads),
        ];
    }

    /**
     * @param  iterable<mixed>  $puckPayloads
     * @return array<int, array{id: int, displayName: string, previewUrl: string, mimeType: string}>
     */
    private function media(iterable $puckPayloads): array
    {
        $mediaIds = ($this->extractPuckMediaIds)($puckPayloads);

        if ($mediaIds === []) {
            return [];
        }

        sort($mediaIds);

        return $this->remember('media:'.implode(',', $mediaIds), fn (): array => Media::query()
            ->whereIn('id', $mediaIds)
            ->get()
            ->mapWithKeys(fn (Media $media): array => [
                $media->id => [
                    'id' => $media->id,
                    'displayName' => $media->display_name,
                    'previewUrl' => $media->preview_url,
                    'mimeType' => $media->mime_type,
                ],
            ])
            ->all());
    }

    /**
     * @param  list<array{id: int, name: string, slug: string, description: ?string, head: ?string}>  $units
     * @return list<array{id: int, name: string, slug: string, location: ?string, items: list<array<string, mixed>>}>
     */
    private function navigationMenus(array $units): array
    {
        return $this->remember('navigation-menus:'.md5(json_encode($units, JSON_THROW_ON_ERROR)), function () use ($units): array {
            $menus = NavigationMenu::query()
                ->where('is_active', true)
                ->with('items')
                ->orderBy('location')
                ->orderBy('name')
                ->get();

            $items = $menus
                ->flatMap(fn (NavigationMenu $menu): Collection => $menu->items)
                ->filter(fn (NavigationItem $item): bool => $item->is_active)
                ->values();
            $navigationItemUrls = $this->navigationItemUrls($items);
            $unitNavigationChildren = $this->unitNavigationChildren($units);

            return array_values($menus
                ->map(fn (NavigationMenu $menu): array => [
                    'id' => $menu->id,
                    'name' => $menu->name,
                    'slug' => $menu->slug,
                    'location' => $menu->location,
                    'items' => $this->buildNavigationTree(
                        array_values($menu->items->where('is_active', true)->all()),
                        $navigationItemUrls,
                        $unitNavigationChildren,
                    ),
                ])
                ->all());
        });
    }

    /**
     * @param  list<NavigationItem>  $items
     * @param  array<int, string>  $navigationItemUrls
     * @param  list<array{id: int, title: string, type: string, url: string, target: string, children: list<array<string, mixed>>}>  $unitNavigationChildren
     * @return list<array<string, mixed>>
     */
    private function buildNavigationTree(array $items, array $navigationItemUrls, array $unitNavigationChildren, ?int $parentId = null): array
    {
        return array_values(collect($items)
            ->filter(fn (NavigationItem $item): bool => $item->parent_id === $parentId)
            ->flatMap(function (NavigationItem $item) use ($items, $navigationItemUrls, $unitNavigationChildren): array {
                if ($item->type === 'unit') {
                    return [[
                        'id' => $item->id,
                        'title' => $item->title,
                        'type' => $item->type,
                        'url' => '#',
                        'target' => $item->target,
                        'children' => $unitNavigationChildren,
                    ]];
                }

                return [[
                    'id' => $item->id,
                    'title' => $item->title,
                    'type' => $item->type,
                    'url' => $navigationItemUrls[$item->id] ?? '#',
                    'target' => $item->target,
                    'children' => $this->buildNavigationTree($items, $navigationItemUrls, $unitNavigationChildren, $item->id),
                ]];
            })
            ->all());
    }

    /**
     * @param  Collection<int, NavigationItem>  $items
     * @return array<int, string>
     */
    private function navigationItemUrls(Collection $items): array
    {
        $pageIds = $this->navigationLinkableIds($items, Page::class);
        $postIds = $this->navigationLinkableIds($items, Post::class);
        $categoryIds = $this->navigationLinkableIds($items, PostCategory::class);

        $pages = $pageIds === []
            ? collect()
            : Page::query()
                ->whereIn('id', $pageIds)
                ->get(['id', 'slug'])
                ->keyBy('id');
        $posts = $postIds === []
            ? collect()
            : Post::query()
                ->with('categories')
                ->whereIn('id', $postIds)
                ->get()
                ->keyBy('id');
        $categories = $categoryIds === []
            ? collect()
            : PostCategory::query()
                ->whereIn('id', $categoryIds)
                ->get(['id', 'slug'])
                ->keyBy('id');

        return $items
            ->mapWithKeys(function (NavigationItem $item) use ($pages, $posts, $categories): array {
                if ($item->url) {
                    return [$item->id => $item->url];
                }

                if ($item->linkable_type === Page::class && $item->linkable_id) {
                    $page = $pages->get($item->linkable_id);

                    return [$item->id => $page instanceof Page ? '/'.$page->slug : '#'];
                }

                if ($item->linkable_type === Post::class && $item->linkable_id) {
                    $post = $posts->get($item->linkable_id);

                    if ($post instanceof Post) {
                        $primaryCategory = $post->categories
                            ->where('is_active', true)
                            ->sortBy('sort_order')
                            ->first();

                        if ($primaryCategory instanceof PostCategory) {
                            return [$item->id => '/'.$primaryCategory->slug.'/'.$post->slug];
                        }
                    }

                    return [$item->id => '#'];
                }

                if ($item->linkable_type === PostCategory::class && $item->linkable_id) {
                    $category = $categories->get($item->linkable_id);

                    return [$item->id => $category instanceof PostCategory ? '/'.$category->slug : '#'];
                }

                return [$item->id => '#'];
            })
            ->all();
    }

    /**
     * @param  Collection<int, NavigationItem>  $items
     * @return list<int>
     */
    private function navigationLinkableIds(Collection $items, string $linkableType): array
    {
        $ids = [];

        foreach ($items as $item) {
            if ($item->linkable_type !== $linkableType || ! is_int($item->linkable_id)) {
                continue;
            }

            $ids[] = $item->linkable_id;
        }

        return array_values(array_unique($ids));
    }

    /**
     * @param  list<array{id: int, name: string, slug: string, description: ?string, head: ?string}>  $units
     * @return list<array{id: int, title: string, type: string, url: string, target: string, children: list<array<string, mixed>>}>
     */
    private function unitNavigationChildren(array $units): array
    {
        return array_map(fn (array $unit): array => [
            'id' => 100000 + $unit['id'],
            'title' => $unit['name'],
            'type' => 'unit',
            'url' => '/don-vi/'.$unit['slug'],
            'target' => '_self',
            'children' => [],
        ], $units);
    }

    /** @return list<array{id: int, title: string, slug: string, url: ?string, excerpt: ?string, date: ?string, author: ?string, thumbnailUrl: ?string, categoryIds: list<int>, categoryNames: list<string>}> */
    private function posts(?User $viewer = null, bool $enforceVisibility = false): array
    {
        return $this->remember($this->viewerCacheKey('posts', $viewer, $enforceVisibility), function () use ($viewer, $enforceVisibility): array {
            $query = Post::query()
                ->with(['author', 'categories', 'thumbnail'])
                ->latest('published_at')
                ->latest()
                ->limit(30);

            if ($enforceVisibility) {
                $query->where('status', 'published');
                $this->applyVisibilityConstraints($query, $viewer);
            } else {
                $query->where('status', 'published');
            }

            return array_values($query
                ->get()
                ->map(function (Post $post): array {
                    $categoryIds = array_values(
                        $post->categories
                            ->map(static fn (PostCategory $category): int => $category->id)
                            ->all(),
                    );

                    $categoryNames = array_values(
                        $post->categories
                            ->map(static fn (PostCategory $category): string => $category->name)
                            ->filter(static fn (string $name): bool => $name !== '')
                            ->all(),
                    );

                    $primaryCategory = $post->categories
                        ->where('is_active', true)
                        ->sortBy('sort_order')
                        ->first();

                    return [
                        'id' => $post->id,
                        'title' => $post->title,
                        'slug' => $post->slug,
                        'url' => $primaryCategory instanceof PostCategory ? '/'.$primaryCategory->slug.'/'.$post->slug : null,
                        'excerpt' => $post->excerpt,
                        'date' => $this->formatDate($post->published_at),
                        'author' => $post->author?->name,
                        'thumbnailUrl' => $post->thumbnail?->preview_url,
                        'categoryIds' => $categoryIds,
                        'categoryNames' => $categoryNames,
                    ];
                })
                ->all());
        });
    }

    /** @return list<array{id: int, name: string, slug: string, parentId: ?int, description: ?string}> */
    private function categories(): array
    {
        return $this->remember('categories', fn (): array => array_values(PostCategory::query()
            ->where('is_active', true)
            ->withCount(['posts' => function (Builder $query): void {
                $query->where('status', 'published');
            }])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (PostCategory $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'parentId' => $category->parent_id,
                'description' => $category->description,
                'postCount' => $category->posts_count,
            ])
            ->all()));
    }

    /** @return list<array{id: int, name: string, fullName: string, academicTitle: ?string, slug: string, email: ?string, phone: ?string, avatarUrl: ?string, position: ?string, unitIds: list<int>, expertise: ?string}> */
    private function staff(): array
    {
        return $this->remember('staff', fn (): array => array_values(StaffProfile::query()
            ->where('is_public', true)
            ->with(['avatar', 'appointments.position', 'appointments.unit'])
            ->orderBy('full_name')
            ->limit(30)
            ->get()
            ->map(function (StaffProfile $staffProfile): array {
                $primaryAppointment = $staffProfile->appointments->first();
                $unitIds = array_values(
                    $staffProfile->appointments
                        ->map(static fn ($appointment): int => $appointment->unit_id)
                        ->all(),
                );

                return [
                    'id' => $staffProfile->id,
                    'name' => $staffProfile->displayName(),
                    'fullName' => $staffProfile->full_name,
                    'academicTitle' => $staffProfile->academic_title,
                    'slug' => $staffProfile->slug,
                    'email' => $staffProfile->email,
                    'phone' => $staffProfile->phone,
                    'avatarUrl' => $staffProfile->avatar ? Storage::disk($staffProfile->avatar->disk)->url($staffProfile->avatar->path) : null,
                    'position' => $primaryAppointment?->position?->name,
                    'unitIds' => $unitIds,
                    'expertise' => $primaryAppointment?->unit?->name,
                ];
            })
            ->all()));
    }

    /** @return list<array{id: int, name: string, slug: string, description: ?string, head: ?string}> */
    private function units(): array
    {
        return $this->remember('units', fn (): array => array_values(Unit::query()
            ->where('is_active', true)
            ->with(['staffAppointments.staffProfile', 'staffAppointments.position'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (Unit $unit): array => [
                'id' => $unit->id,
                'name' => $unit->name,
                'slug' => $unit->slug,
                'description' => $this->plainTextFromBlocknote($unit->description),
                'head' => $unit->staffAppointments->first()?->staffProfile?->full_name,
            ])
            ->all()));
    }

    /** @return list<array{id: int, title: string, slug: string, url: string}> */
    private function pages(?User $viewer = null, bool $enforceVisibility = false): array
    {
        return $this->remember($this->viewerCacheKey('pages', $viewer, $enforceVisibility), function () use ($viewer, $enforceVisibility): array {
            $query = Page::query()
                ->orderBy('title')
                ->limit(50);

            if ($enforceVisibility) {
                $query->whereNotNull('published_at');
                $this->applyVisibilityConstraints($query, $viewer);
            } else {
                $query->whereNotNull('published_at');
            }

            return array_values($query
                ->get(['id', 'title', 'slug'])
                ->map(fn (Page $page): array => [
                    'id' => $page->id,
                    'title' => $page->title,
                    'slug' => $page->slug,
                    'url' => '/'.$page->slug,
                ])
                ->all());
        });
    }

    /**
     * @template TModel of \Illuminate\Database\Eloquent\Model
     *
     * @param  Builder<TModel>  $query
     */
    private function applyVisibilityConstraints(Builder $query, ?User $viewer): void
    {
        if (! $viewer instanceof User) {
            $query->where('visibility', 'public');

            return;
        }

        $studentCode = $viewer->student?->student_code;
        $modelClass = $query->getModel()::class;
        $qualifiedIdColumn = $query->getModel()->qualifyColumn('id');

        $query->where(function (Builder $visibilityQuery) use ($modelClass, $qualifiedIdColumn, $studentCode): void {
            $visibilityQuery->whereIn('visibility', ['public', 'authenticated']);

            if ($studentCode !== null && trim($studentCode) !== '') {
                $visibilityQuery
                    ->orWhere('visibility', 'students')
                    ->orWhere(function (Builder $allowlistQuery) use ($modelClass, $qualifiedIdColumn, $studentCode): void {
                        $allowlistQuery
                            ->where('visibility', 'student_groups')
                            ->whereExists(function (QueryBuilder $existsQuery) use ($modelClass, $qualifiedIdColumn, $studentCode): void {
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
                                    ->where('content_student_group_access.accessible_type', $modelClass)
                                    ->where('student_group_members.student_code', trim($studentCode));
                            });
                    });
            }
        });
    }

    private function formatDate(mixed $value): ?string
    {
        if ($value instanceof CarbonInterface) {
            return $value->format('d/m/Y');
        }

        return null;
    }

    private function plainTextFromBlocknote(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        try {
            $blocks = json_decode($value, true, flags: JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return null;
        }

        if (! is_array($blocks)) {
            return null;
        }

        $text = collect($blocks)
            ->flatMap(fn (mixed $block): array => is_array($block) && isset($block['content']) && is_array($block['content']) ? $block['content'] : [])
            ->pluck('text')
            ->filter()
            ->implode(' ');

        return $text !== '' ? str($text)->limit(180)->toString() : null;
    }

    private function viewerCacheKey(string $prefix, ?User $viewer, bool $enforceVisibility): string
    {
        $viewerKey = $viewer instanceof User ? $viewer->getKey() : 'guest';

        if (! is_scalar($viewerKey)) {
            $viewerKey = 'guest';
        }

        return implode(':', [
            $prefix,
            $enforceVisibility ? 'visible' : 'all',
            (string) $viewerKey,
            trim((string) $viewer?->student?->student_code),
        ]);
    }

    /**
     * @template TValue
     *
     * @param  Closure(): TValue  $callback
     * @return TValue
     */
    private function remember(string $key, Closure $callback): mixed
    {
        $request = request();
        $cache = $request->attributes->get('puck_dynamic_data_cache', []);

        if (! is_array($cache)) {
            $cache = [];
        }

        if (! array_key_exists($key, $cache)) {
            $cache[$key] = $callback();
            $request->attributes->set('puck_dynamic_data_cache', $cache);
        }

        return $cache[$key];
    }
}
