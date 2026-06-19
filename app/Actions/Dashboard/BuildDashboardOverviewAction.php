<?php

declare(strict_types=1);

namespace App\Actions\Dashboard;

use App\Models\Media;
use App\Models\Page;
use App\Models\Position;
use App\Models\Post;
use App\Models\StaffAppointment;
use App\Models\StaffProfile;
use App\Models\Student;
use App\Models\Unit;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

class BuildDashboardOverviewAction
{
    /**
     * @return array{
     *     stats: list<array{
     *         key: string,
     *         label: string,
     *         value: int,
     *         helper: string,
     *         change: int,
     *         intent: 'primary'|'info'|'warning'|'success'
     *     }>,
     *     workspace: array{
     *         accessibleCollections: int,
     *         studentRecords: int,
     *         mediaAssets: int,
     *         organizationNodes: int
     *     },
     *     recentActivity: list<array{
     *         id: string,
     *         kind: string,
     *         title: string,
     *         description: string,
     *         status: string,
     *         updatedAt: string
     *     }>,
     *     pendingReview: list<array{
     *         id: string,
     *         kind: string,
     *         title: string,
     *         owner: string,
     *         status: string,
     *         updatedAt: string
     *     }>
     * }
     */
    public function __invoke(): array
    {
        $startOfMonth = now()->startOfMonth();

        $publishedPostsCount = Post::query()->where('status', 'published')->count();
        $publishedPagesCount = Page::query()->count();
        $mediaAssetsCount = Media::query()->count();

        $unitsCount = Unit::query()->count();
        $positionsCount = Position::query()->count();
        $appointmentsCount = StaffAppointment::query()->count();
        $usersCount = User::query()->count();

        return [
            'stats' => [
                [
                    'key' => 'posts',
                    'label' => 'Bài viết đã xuất bản',
                    'value' => $publishedPostsCount,
                    'helper' => '+'.$this->countPostsPublishedSince($startOfMonth).' trong tháng này',
                    'change' => $this->countPostsPublishedSince($startOfMonth),
                    'intent' => 'primary',
                ],
                [
                    'key' => 'pages',
                    'label' => 'Trang đã xuất bản',
                    'value' => $publishedPagesCount,
                    'helper' => 'Các trang tĩnh trên hệ thống',
                    'change' => 0,
                    'intent' => 'success',
                ],
                [
                    'key' => 'media',
                    'label' => 'Tệp trong thư viện',
                    'value' => $mediaAssetsCount,
                    'helper' => 'Các tệp đa phương tiện đã tải lên',
                    'change' => 0,
                    'intent' => 'success',
                ],
            ],
            'workspace' => [
                'accessibleCollections' => 6,
                'studentRecords' => Student::query()->count(),
                'mediaAssets' => $mediaAssetsCount,
                'organizationNodes' => $unitsCount + $positionsCount + $appointmentsCount,
                'pagesCount' => $publishedPagesCount,
                'unitsCount' => $unitsCount,
                'positionsCount' => $positionsCount,
                'appointmentsCount' => $appointmentsCount,
                'usersCount' => $usersCount,
            ],
            'recentActivity' => $this->recentActivity(),
            'pendingReview' => $this->pendingReviewItems(),
        ];
    }

    private function countPostsPublishedSince(CarbonInterface $date): int
    {
        return Post::query()
            ->where('status', 'published')
            ->where('published_at', '>=', $date)
            ->count();
    }

    /**
     * @return list<array{
     *     id: string,
     *     kind: string,
     *     title: string,
     *     description: string,
     *     status: string,
     *     updatedAt: string
     * }>
     */
    private function recentActivity(): array
    {
        $postItems = Post::query()
            ->with('author:id,name')
            ->latest('updated_at')
            ->limit(4)
            ->get()
            ->map(function (Post $post): array {
                /** @var User|null $author */
                $author = $post->author;

                return [
                    'id' => 'post-'.$post->id,
                    'kind' => 'Bài viết',
                    'title' => $post->title,
                    'description' => 'Bài viết được '.($post->created_at == $post->updated_at ? 'tạo' : 'cập nhật').' bởi '.($author instanceof User ? $author->name : 'hệ thống'),
                    'status' => $post->status,
                    'updatedAt' => $this->toIsoString($post->updated_at),
                ];
            })
            ->all();

        $pageItems = Page::query()
            ->with('author:id,name')
            ->latest('updated_at')
            ->limit(3)
            ->get()
            ->map(function (Page $page): array {
                /** @var User|null $author */
                $author = $page->author;

                return [
                    'id' => 'page-'.$page->id,
                    'kind' => 'Trang',
                    'title' => $page->title,
                    'description' => 'Trang được '.($page->created_at == $page->updated_at ? 'tạo' : 'cập nhật').' bởi '.($author instanceof User ? $author->name : 'hệ thống'),
                    'status' => 'published',
                    'updatedAt' => $this->toIsoString($page->updated_at),
                ];
            })
            ->all();

        $staffProfileItems = StaffProfile::query()
            ->with('user:id,name')
            ->latest('updated_at')
            ->limit(3)
            ->get()
            ->map(function (StaffProfile $profile): array {
                $updaterName = $profile->user->name ?? 'hệ thống';

                return [
                    'id' => 'staff-'.$profile->id,
                    'kind' => 'Hồ sơ cán bộ',
                    'title' => 'Hồ sơ cán bộ: '.($profile->academic_title ? $profile->academic_title.'. ' : '').$profile->full_name,
                    'description' => 'Hồ sơ được cập nhật bởi '.$updaterName,
                    'status' => $profile->is_public ? 'published' : 'draft',
                    'updatedAt' => $this->toIsoString($profile->updated_at),
                ];
            })
            ->all();

        /** @var Collection<int, array{id: string, kind: string, title: string, description: string, status: string, updatedAt: string}> $items */
        $items = collect(array_merge($postItems, $pageItems, $staffProfileItems))
            ->sortByDesc('updatedAt')
            ->take(8)
            ->values();

        /** @var list<array{id: string, kind: string, title: string, description: string, status: string, updatedAt: string}> $recentActivity */
        $recentActivity = $items->all();

        return $recentActivity;
    }

    /**
     * @return list<array{
     *     id: string,
     *     kind: string,
     *     title: string,
     *     owner: string,
     *     status: string,
     *     updatedAt: string
     * }>
     */
    private function pendingReviewItems(): array
    {
        $pendingPostItems = Post::query()
            ->with('author:id,name')
            ->where('status', 'pending')
            ->latest('updated_at')
            ->limit(4)
            ->get()
            ->map(function (Post $post): array {
                /** @var User|null $author */
                $author = $post->author;

                return [
                    'id' => 'post-pending-'.$post->id,
                    'kind' => 'Bài viết',
                    'title' => $post->title,
                    'owner' => $author instanceof User ? $author->name : 'Hệ thống',
                    'status' => $post->status,
                    'updatedAt' => $this->toIsoString($post->updated_at),
                ];
            })
            ->all();

        /** @var Collection<int, array{id: string, kind: string, title: string, owner: string, status: string, updatedAt: string}> $items */
        $items = collect($pendingPostItems)
            ->sortByDesc('updatedAt')
            ->take(6)
            ->values();

        /** @var list<array{id: string, kind: string, title: string, owner: string, status: string, updatedAt: string}> $pendingReviewItems */
        $pendingReviewItems = $items->all();

        return $pendingReviewItems;
    }

    private function toIsoString(?CarbonInterface $date): string
    {
        return $date?->toIso8601String() ?? now()->toIso8601String();
    }
}
