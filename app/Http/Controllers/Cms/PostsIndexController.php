<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use App\QueryBuilders\CmsPostsQueryBuilder;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Inertia\Response;

final class PostsIndexController extends Controller
{
    private const DEFAULT_PER_PAGE = 10;

    /** @var list<int> */
    private const ALLOWED_PER_PAGE = [10, 25, 50];

    /** @var list<string> */
    private const ALLOWED_SORTS = ['title', 'status', 'published_at', 'created_at', 'author'];

    /** @var list<string> */
    private const ALLOWED_STATUSES = ['all', 'draft', 'pending', 'published', 'rejected'];

    public function __invoke(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $status = $this->resolveStatus((string) $request->query('status', 'all'));
        $categoryId = $request->query('categoryId') ? (int) $request->query('categoryId') : null;
        $sort = $this->resolveSort((string) $request->query('sort', 'created_at'));
        $direction = $this->resolveDirection((string) $request->query('direction', 'desc'));
        $page = max((int) $request->query('page', 1), 1);
        $perPage = $this->resolvePerPage((int) $request->query('perPage', self::DEFAULT_PER_PAGE));

        $queryBuilderRequest = Request::create(
            $request->path(),
            Request::METHOD_GET,
            array_filter([
                'filter' => array_filter([
                    'search' => $search !== '' ? $search : null,
                    'status' => $status !== 'all' ? $status : null,
                    'category_id' => $categoryId,
                ]),
                'sort' => ($direction === 'desc' ? '-' : '').$sort,
            ]),
        );

        $posts = CmsPostsQueryBuilder::make($queryBuilderRequest)
            ->with(['author', 'categories'])
            ->paginate($perPage, ['*'], 'page', $page);

        $rows = $posts->getCollection()
            ->map(fn (Post $post): array => $this->mapPostRow($post))
            ->values()
            ->all();

        $categoryOptions = PostCategory::query()
            ->select(['id', 'name'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (PostCategory $cat): array => [
                'value' => (string) $cat->id,
                'label' => $cat->name,
            ])
            ->all();

        return inertia('cms/posts/index', [
            'can' => [
                'managePosts' => $request->user()?->can('create', Post::class) ?? false,
                'publishPosts' => $request->user()?->can('publish posts') ?? false,
            ],
            'posts' => [
                'data' => $rows,
                'meta' => [
                    'currentPage' => $posts->currentPage(),
                    'lastPage' => $posts->lastPage(),
                    'perPage' => $posts->perPage(),
                    'total' => $posts->total(),
                    'from' => $posts->firstItem(),
                    'to' => $posts->lastItem(),
                ],
            ],
            'categoryOptions' => $categoryOptions,
        ]);
    }

    private function resolveDirection(string $direction): string
    {
        return $direction === 'asc' ? 'asc' : 'desc';
    }

    private function resolvePerPage(int $perPage): int
    {
        if (in_array($perPage, self::ALLOWED_PER_PAGE, true)) {
            return $perPage;
        }

        return self::DEFAULT_PER_PAGE;
    }

    private function resolveSort(string $sort): string
    {
        if (in_array($sort, self::ALLOWED_SORTS, true)) {
            return $sort;
        }

        return 'created_at';
    }

    private function resolveStatus(string $status): string
    {
        if (in_array($status, self::ALLOWED_STATUSES, true)) {
            return $status;
        }

        return 'all';
    }

    /**
     * @return array{
     *     id: int,
     *     title: string,
     *     slug: string,
     *     categoryIds: list<int>,
     *     categoryNames: list<string>,
     *     excerpt: ?string,
     *     status: string,
     *     authorName: ?string,
     *     publishedAt: ?string,
     *     updatedAt: string
     * }
     */
    private function mapPostRow(Post $post): array
    {
        /** @var int $postId */
        $postId = $post->getKey();

        return [
            'id' => $postId,
            'title' => $post->title,
            'slug' => $post->slug,
            'categoryIds' => $post->categories->pluck('id')->map(fn (mixed $id): int => (int) $id)->values()->all(),
            'categoryNames' => $post->categories->pluck('name')->values()->all(),
            'excerpt' => $post->excerpt,
            'status' => $post->status,
            'authorName' => $post->author?->name,
            'publishedAt' => $this->formatDateTime($post->published_at),
            'updatedAt' => $this->formatDateTime($post->updated_at) ?? now()->toAtomString(),
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
}
