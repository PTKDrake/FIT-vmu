<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\StaffProfile;
use App\Models\User;
use App\QueryBuilders\CmsStaffProfilesQueryBuilder;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Inertia\Response;

final class StaffProfilesIndexController extends Controller
{
    private const DEFAULT_PER_PAGE = 10;

    /** @var list<int> */
    private const ALLOWED_PER_PAGE = [10, 25, 50];

    /** @var list<string> */
    private const ALLOWED_SORTS = ['full_name', 'created_at'];

    /** @var list<string> */
    private const ALLOWED_STATUSES = ['all', 'public', 'private'];

    public function __invoke(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $status = $this->resolveStatus((string) $request->query('status', 'all'));
        $sort = $this->resolveSort((string) $request->query('sort', 'created_at'));
        $direction = $this->resolveDirection((string) $request->query('direction', 'desc'));
        $page = max((int) $request->query('page', 1), 1);
        $perPage = $this->resolvePerPage((int) $request->query('perPage', self::DEFAULT_PER_PAGE));

        $filterParams = [];
        if ($search !== '') {
            $filterParams['search'] = $search;
        }
        if ($status === 'public') {
            $filterParams['is_public'] = '1';
        } elseif ($status === 'private') {
            $filterParams['is_public'] = '0';
        }

        $queryBuilderRequest = Request::create(
            $request->path(),
            Request::METHOD_GET,
            array_filter([
                'filter' => $filterParams,
                'sort' => ($direction === 'desc' ? '-' : '').$sort,
            ])
        );

        $profiles = CmsStaffProfilesQueryBuilder::make($queryBuilderRequest)
            ->with(['avatar', 'user'])
            ->paginate($perPage, ['*'], 'page', $page);

        $rows = $profiles->getCollection()
            ->map(fn (StaffProfile $profile): array => $this->mapStaffProfileRow($profile))
            ->values()
            ->all();

        return inertia('cms/staff-profiles/index', [
            'can' => [
                'createStaffProfile' => $request->user()?->can('create', StaffProfile::class) ?? false,
                'deleteStaffProfile' => $request->user()?->can('delete staff profiles') ?? false,
            ],
            'profiles' => [
                'data' => $rows,
                'meta' => [
                    'currentPage' => $profiles->currentPage(),
                    'lastPage' => $profiles->lastPage(),
                    'perPage' => $profiles->perPage(),
                    'total' => $profiles->total(),
                    'from' => $profiles->firstItem(),
                    'to' => $profiles->lastItem(),
                ],
            ],
        ]);
    }

    private function resolveDirection(string $direction): string
    {
        return $direction === 'desc' ? 'desc' : 'asc';
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
     *     fullName: string,
     *     slug: string,
     *     email: ?string,
     *     phone: ?string,
     *     avatarUrl: ?string,
     *     isPublic: bool,
     *     userEmail: string,
     *     updatedAt: string
     * }
     */
    private function mapStaffProfileRow(StaffProfile $profile): array
    {
        /** @var int $profileId */
        $profileId = $profile->getKey();

        return [
            'id' => $profileId,
            'fullName' => $profile->full_name,
            'slug' => $profile->slug,
            'email' => $profile->email,
            'phone' => $profile->phone,
            'avatarUrl' => $profile->avatar?->preview_url,
            'isPublic' => $profile->is_public,
            'userEmail' => $profile->user instanceof User ? $profile->user->email : '',
            'updatedAt' => $this->formatDateTime($profile->updated_at) ?? now()->toAtomString(),
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
