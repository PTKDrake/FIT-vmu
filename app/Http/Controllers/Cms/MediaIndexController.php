<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\User;
use App\QueryBuilders\CmsMediaQueryBuilder;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

final class MediaIndexController extends Controller
{
    private const DEFAULT_PER_PAGE = 24;

    /** @var list<int> */
    private const ALLOWED_PER_PAGE = [24, 48, 96];

    /** @var list<string> */
    private const ALLOWED_DATE_FILTERS = ['all', 'today', '7d', '30d', '365d'];

    /** @var list<string> */
    private const ALLOWED_SORTS = ['created_at', 'display_name', 'size'];

    /** @var list<string> */
    private const ALLOWED_TYPES = ['all', 'image', 'video', 'audio'];

    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $search = trim((string) $request->query('search', ''));
        $type = $this->resolveType((string) $request->query('type', 'all'));
        $uploadedBy = max((int) $request->query('uploadedBy', 0), 0);
        $date = $this->resolveDateFilter((string) $request->query('date', 'all'));
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
                    'kind' => $type !== 'all' ? $type : null,
                    'uploaded_by' => $uploadedBy > 0 ? $uploadedBy : null,
                    'uploaded_at' => $date !== 'all' ? $date : null,
                ]),
                'sort' => ($direction === 'desc' ? '-' : '').$sort,
            ]),
        );

        $media = CmsMediaQueryBuilder::make($queryBuilderRequest)
            ->with('uploadedBy')
            ->withCount([
                'avatarStaffProfiles',
                'documentFiles',
                'postThumbnails',
                'pageThumbnails',
            ])
            ->paginate($perPage, ['*'], 'page', $page);

        $rows = $media->getCollection()
            ->map(fn (Media $media): array => $this->mapMediaRow($media))
            ->values()
            ->all();

        $uploaders = User::query()
            ->whereHas('uploadedMedia')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (User $user): array => [
                'id' => $user->getKey(),
                'name' => $user->name,
            ])
            ->values()
            ->all();

        return inertia('cms/media/index', [
            'can' => [
                'deleteMedia' => $user?->can('deleteAny', Media::class) ?? false,
                'duplicateMedia' => $user?->can('create', Media::class) ?? false,
                'renameMedia' => $user?->can('updateAny', Media::class) ?? false,
                'uploadMedia' => $user?->can('create', Media::class) ?? false,
            ],
            'media' => [
                'data' => $rows,
                'filters' => [
                    'uploaders' => $uploaders,
                ],
                'meta' => [
                    'currentPage' => $media->currentPage(),
                    'lastPage' => $media->lastPage(),
                    'perPage' => $media->perPage(),
                    'total' => $media->total(),
                    'from' => $media->firstItem(),
                    'to' => $media->lastItem(),
                ],
            ],
        ]);
    }

    private function resolveDateFilter(string $date): string
    {
        if (in_array($date, self::ALLOWED_DATE_FILTERS, true)) {
            return $date;
        }

        return 'all';
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

    private function resolveType(string $type): string
    {
        if (in_array($type, self::ALLOWED_TYPES, true)) {
            return $type;
        }

        return 'all';
    }

    /**
     * @return array{
     *     id: int,
     *     extension: string,
     *     kind: 'audio'|'image'|'video',
     *     mimeType: string,
     *     displayName: string,
     *     previewUrl: string,
     *     size: int,
     *     uploadedAt: string,
     *     uploader: array{id: int, name: string}|null,
     *     usage: array{documents: int, pages: int, posts: int, staffProfiles: int, total: int}
     * }
     */
    private function mapMediaRow(Media $media): array
    {
        $kind = $this->resolveKind($media->mime_type);
        $previewUrl = Storage::disk($media->disk)->url($media->path);
        /** @var int $mediaId */
        $mediaId = $media->getKey();
        $uploaderId = $media->uploadedBy?->getKey();
        $documentsCount = $this->normalizeCount($media->getAttribute('document_files_count'));
        $pagesCount = $this->normalizeCount($media->getAttribute('page_thumbnails_count'));
        $postsCount = $this->normalizeCount($media->getAttribute('post_thumbnails_count'));
        $staffProfilesCount = $this->normalizeCount($media->getAttribute('avatar_staff_profiles_count'));

        return [
            'id' => $mediaId,
            'extension' => strtolower(pathinfo($media->display_name, PATHINFO_EXTENSION)),
            'kind' => $kind,
            'mimeType' => $media->mime_type,
            'displayName' => $media->display_name,
            'previewUrl' => $previewUrl,
            'size' => $media->size,
            'uploadedAt' => $this->formatDateTime($media->created_at) ?? now()->toAtomString(),
            'uploader' => $media->uploadedBy
                ? [
                    'id' => $this->normalizeCount($uploaderId),
                    'name' => $media->uploadedBy->name,
                ]
                : null,
            'usage' => [
                'documents' => $documentsCount,
                'pages' => $pagesCount,
                'posts' => $postsCount,
                'staffProfiles' => $staffProfilesCount,
                'total' => $documentsCount + $pagesCount + $postsCount + $staffProfilesCount,
            ],
        ];
    }

    /** @return 'audio'|'image'|'video' */
    private function resolveKind(string $mimeType): string
    {
        if (str_starts_with($mimeType, 'video/')) {
            return 'video';
        }

        if (str_starts_with($mimeType, 'audio/')) {
            return 'audio';
        }

        return 'image';
    }

    private function normalizeCount(mixed $value): int
    {
        if (is_int($value)) {
            return $value;
        }

        if (is_numeric($value)) {
            return (int) $value;
        }

        return 0;
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
