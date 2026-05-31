<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\QueryBuilders\CmsUsersQueryBuilder;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Inertia\Response;
use Spatie\Permission\Models\Role;

final class UsersIndexController extends Controller
{
    private const DEFAULT_PER_PAGE = 10;

    /** @var list<int> */
    private const ALLOWED_PER_PAGE = [10, 25, 50];

    /** @var list<string> */
    private const ALLOWED_SORTS = ['name', 'email', 'created_at', 'email_verified_at'];

    /** @var list<string> */
    private const ALLOWED_STATUSES = ['all', 'verified', 'unverified'];

    public function __invoke(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $status = $this->resolveStatus((string) $request->query('status', 'all'));
        $role = trim((string) $request->query('role', ''));
        $sort = $this->resolveSort((string) $request->query('sort', 'created_at'));
        $direction = $this->resolveDirection((string) $request->query('direction', 'desc'));
        $page = max((int) $request->query('page', 1), 1);
        $perPage = $this->resolvePerPage((int) $request->query('perPage', self::DEFAULT_PER_PAGE));

        $filterParams = [];

        if ($search !== '') {
            $filterParams['search'] = $search;
        }

        if ($status !== 'all') {
            $filterParams['verified'] = $status === 'verified' ? '1' : '0';
        }

        if ($role !== '') {
            $filterParams['role'] = $role;
        }

        $queryBuilderRequest = Request::create(
            $request->path(),
            Request::METHOD_GET,
            array_filter([
                'filter' => $filterParams,
                'sort' => ($direction === 'desc' ? '-' : '').$sort,
            ]),
        );

        $users = CmsUsersQueryBuilder::make($queryBuilderRequest)
            ->with('roles')
            ->paginate($perPage, ['*'], 'page', $page);

        $rows = $users->getCollection()
            ->map(fn (User $user): array => $this->mapUserRow($user))
            ->values()
            ->all();

        $roleOptions = Role::query()
            ->select(['name'])
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role): array => [
                'value' => $role->name,
                'label' => $role->name,
            ])
            ->all();

        return inertia('cms/users/index', [
            'can' => [
                'createUsers' => $request->user()?->can('create', User::class) ?? false,
                'manageUsers' => $request->user()?->can('manage users') ?? false,
                'manageRoles' => $request->user()?->can('manage roles') ?? false,
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
                'role' => $role,
                'sort' => $sort,
                'direction' => $direction,
                'perPage' => $perPage,
            ],
            'users' => [
                'data' => $rows,
                'meta' => [
                    'currentPage' => $users->currentPage(),
                    'lastPage' => $users->lastPage(),
                    'perPage' => $users->perPage(),
                    'total' => $users->total(),
                    'from' => $users->firstItem(),
                    'to' => $users->lastItem(),
                ],
            ],
            'roleOptions' => $roleOptions,
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
     *     name: string,
     *     email: string,
     *     roles: list<string>,
     *     status: string,
     *     isVerified: bool,
     *     emailVerifiedAt: ?string,
     *     createdAt: string,
     *     updatedAt: string
     * }
     */
    private function mapUserRow(User $user): array
    {
        /** @var int $userId */
        $userId = $user->getKey();

        /** @var list<string> $roleNames */
        $roleNames = $user->getRoleNames()->sort()->values()->all();
        $isVerified = $user->email_verified_at !== null;

        return [
            'id' => $userId,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $roleNames,
            'status' => $isVerified ? 'verified' : 'unverified',
            'isVerified' => $isVerified,
            'emailVerifiedAt' => $this->formatDateTime($user->email_verified_at),
            'createdAt' => $this->formatDateTime($user->created_at) ?? now()->toAtomString(),
            'updatedAt' => $this->formatDateTime($user->updated_at) ?? now()->toAtomString(),
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
