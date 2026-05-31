<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Position;
use App\QueryBuilders\CmsPositionsQueryBuilder;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Inertia\Response;

final class PositionsIndexController extends Controller
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

        $positions = CmsPositionsQueryBuilder::make($queryBuilderRequest)
            ->withCount('staffAppointments')
            ->paginate($perPage, ['*'], 'page', $page);

        return inertia('cms/positions/index', [
            'can' => [
                'managePositions' => $request->user()?->can('create', Position::class) ?? false,
            ],
            'positions' => [
                'data' => array_values(
                    $positions->getCollection()
                        ->map(fn (Position $position): array => $this->mapPositionRow($position))
                        ->all(),
                ),
                'meta' => [
                    'currentPage' => $positions->currentPage(),
                    'lastPage' => $positions->lastPage(),
                    'perPage' => $positions->perPage(),
                    'total' => $positions->total(),
                    'from' => $positions->firstItem(),
                    'to' => $positions->lastItem(),
                ],
            ],
        ]);
    }

    /**
     * @return array{
     *     id: int,
     *     name: string,
     *     slug: string,
     *     sortOrder: int,
     *     isActive: bool,
     *     appointmentCount: int,
     *     updatedAt: string
     * }
     */
    private function mapPositionRow(Position $position): array
    {
        /** @var int $positionId */
        $positionId = $position->getKey();

        return [
            'id' => $positionId,
            'name' => $position->name,
            'slug' => $position->slug,
            'sortOrder' => $position->sort_order,
            'isActive' => $position->is_active,
            'appointmentCount' => (int) ($position->staff_appointments_count ?? 0),
            'updatedAt' => $this->formatDateTime($position->updated_at) ?? now()->toAtomString(),
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
