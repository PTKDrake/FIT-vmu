<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\PostCategory;
use App\QueryBuilders\CmsPostCategoriesQueryBuilder;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Inertia\Response;

final class PostCategoriesIndexController extends Controller
{
    private const DEFAULT_PER_PAGE = 10;

    /** @var list<int> */
    private const ALLOWED_PER_PAGE = [10, 25, 50];

    /** @var list<string> */
    private const ALLOWED_DIRECTIONS = ['asc', 'desc'];

    /** @var list<string> */
    private const ALLOWED_STATUS_FILTERS = ['all', 'active', 'inactive'];

    public function __invoke(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $status = $this->resolveStatus((string) $request->query('status', 'all'));
        $sort = $this->resolveSort((string) $request->query('sort', 'sort_order'), ['name', 'sort_order', 'created_at']);
        $direction = $this->resolveDirection((string) $request->query('direction', 'asc'));
        $page = max((int) $request->query('page', 1), 1);
        $perPage = $this->resolvePerPage((int) $request->query('perPage', self::DEFAULT_PER_PAGE));

        $queryBuilderRequest = Request::create(
            $request->path(),
            Request::METHOD_GET,
            array_filter([
                'filter' => array_filter([
                    'search' => $search !== '' ? $search : null,
                    'is_active' => match ($status) {
                        'active' => true,
                        'inactive' => false,
                        default => null,
                    },
                ]),
                'sort' => ($direction === 'desc' ? '-' : '').$sort,
            ]),
        );

        // Bind the request explicitly to avoid empty query issues in Spatie QueryBuilder
        $categories = CmsPostCategoriesQueryBuilder::make($queryBuilderRequest)
            ->with(['parent'])
            ->withCount(['posts', 'children'])
            ->paginate($perPage, ['*'], 'page', $page);

        // All categories for the parent select dropdown
        $parentOptions = PostCategory::query()
            ->select(['id', 'name', 'parent_id'])
            ->orderBy('name')
            ->get()
            ->map(fn (PostCategory $cat): array => [
                'value' => (string) $cat->id,
                'label' => $cat->name,
                'parentId' => $cat->parent_id,
            ])
            ->all();

        return inertia('cms/post-categories/index', [
            'can' => [
                'manageCategories' => $request->user()?->can('create', PostCategory::class) ?? false,
            ],
            'categories' => [
                'data' => array_values(
                    $categories->getCollection()
                        ->map(fn (PostCategory $cat): array => $this->mapCategoryRow($cat))
                        ->all(),
                ),
                'meta' => [
                    'currentPage' => $categories->currentPage(),
                    'lastPage' => $categories->lastPage(),
                    'perPage' => $categories->perPage(),
                    'total' => $categories->total(),
                    'from' => $categories->firstItem(),
                    'to' => $categories->lastItem(),
                ],
            ],
            'parentOptions' => $parentOptions,
        ]);
    }

    /**
     * @return array{
     *     id: int,
     *     name: string,
     *     slug: string,
     *     description: ?string,
     *     parentId: ?int,
     *     parentName: ?string,
     *     sortOrder: int,
     *     isActive: bool,
     *     postCount: int,
     *     childrenCount: int,
     *     updatedAt: string
     * }
     */
    private function mapCategoryRow(PostCategory $cat): array
    {
        /** @var int $catId */
        $catId = $cat->getKey();

        return [
            'id' => $catId,
            'name' => $cat->name,
            'slug' => $cat->slug,
            'description' => $cat->description,
            'parentId' => $cat->parent_id,
            'parentName' => $cat->parent?->name,
            'sortOrder' => $cat->sort_order,
            'isActive' => $cat->is_active,
            'postCount' => (int) ($cat->posts_count ?? 0),
            'childrenCount' => (int) ($cat->children_count ?? 0),
            'updatedAt' => $this->formatDateTime($cat->updated_at) ?? now()->toAtomString(),
        ];
    }

    private function formatDateTime(mixed $value): ?string
    {
        if ($value instanceof CarbonInterface) {
            return $value->toAtomString();
        }

        if (is_string($value) && $value !== '') {
            return $value;
        }

        return null;
    }

    /** @param list<string> $allowedSorts */
    private function resolveSort(string $sort, array $allowedSorts): string
    {
        return in_array($sort, $allowedSorts, true) ? $sort : $allowedSorts[0];
    }

    private function resolveDirection(string $direction): string
    {
        return in_array($direction, self::ALLOWED_DIRECTIONS, true) ? $direction : 'asc';
    }

    private function resolvePerPage(int $perPage): int
    {
        return in_array($perPage, self::ALLOWED_PER_PAGE, true) ? $perPage : self::DEFAULT_PER_PAGE;
    }

    private function resolveStatus(string $status): string
    {
        return in_array($status, self::ALLOWED_STATUS_FILTERS, true) ? $status : 'all';
    }
}
