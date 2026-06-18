<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\QueryBuilders\CmsPagesQueryBuilder;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Inertia\Response;

final class PagesIndexController extends Controller
{
    private const DEFAULT_PER_PAGE = 10;

    /** @var list<int> */
    private const ALLOWED_PER_PAGE = [10, 25, 50];

    /** @var list<string> */
    private const ALLOWED_SORTS = ['title', 'visibility', 'created_at', 'updated_at', 'author'];

    /** @var list<string> */
    private const ALLOWED_VISIBILITIES = ['all', 'public', 'authenticated', 'students', 'student_groups', 'hidden'];

    public function __invoke(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $visibility = $this->resolveVisibility((string) $request->query('status', 'all'));
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
                    'visibility' => $visibility !== 'all' ? $visibility : null,
                ]),
                'sort' => ($direction === 'desc' ? '-' : '').$sort,
            ]),
        );

        app()->instance('request', $queryBuilderRequest);

        $pages = CmsPagesQueryBuilder::make()
            ->with('author')
            ->paginate($perPage, ['*'], 'page', $page);

        app()->instance('request', $request);

        $rows = $pages->getCollection()
            ->map(fn (Page $page): array => $this->mapPageRow($page))
            ->values()
            ->all();

        return inertia('cms/pages/index', [
            'pages' => [
                'data' => $rows,
                'meta' => [
                    'currentPage' => $pages->currentPage(),
                    'lastPage' => $pages->lastPage(),
                    'perPage' => $pages->perPage(),
                    'total' => $pages->total(),
                    'from' => $pages->firstItem(),
                    'to' => $pages->lastItem(),
                ],
            ],
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

    private function resolveVisibility(string $visibility): string
    {
        if (in_array($visibility, self::ALLOWED_VISIBILITIES, true)) {
            return $visibility;
        }

        return 'all';
    }

    /**
     * @return array{
     *     id: int,
     *     title: string,
     *     slug: string,
     *     urlPath: string,
     *     excerpt: ?string,
     *     seoTitle: ?string,
     *     seoDescription: ?string,
     *     visibility: string,
     *     authorName: ?string,
     *     updatedAt: string
     * }
     */
    private function mapPageRow(Page $page): array
    {
        /** @var int $pageId */
        $pageId = $page->getKey();

        return [
            'id' => $pageId,
            'title' => $page->title,
            'slug' => $page->slug,
            'urlPath' => '/'.$page->slug,
            'excerpt' => $page->excerpt,
            'seoTitle' => $page->seo_title,
            'seoDescription' => $page->seo_description,
            'visibility' => $page->visibility,
            'authorName' => $page->author?->name,
            'updatedAt' => $this->formatDateTime($page->updated_at) ?? now()->toAtomString(),
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
