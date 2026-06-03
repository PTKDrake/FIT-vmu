<?php

declare(strict_types=1);

namespace App\Actions\Dashboard;

use App\Models\Media;
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
        $pendingPostsCount = $this->countPendingPosts();
        $publicStaffProfilesCount = StaffProfile::query()->where('is_public', true)->count();

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
                    'key' => 'pending',
                    'label' => 'Bài viết chờ duyệt',
                    'value' => $pendingPostsCount,
                    'helper' => 'Cần xử lý trước khi xuất bản',
                    'change' => $pendingPostsCount,
                    'intent' => 'info',
                ],
                [
                    'key' => 'staff',
                    'label' => 'Hồ sơ cán bộ công khai',
                    'value' => $publicStaffProfilesCount,
                    'helper' => $this->countStaffProfilesCreatedSince($startOfMonth).' hồ sơ mới trong tháng',
                    'change' => $this->countStaffProfilesCreatedSince($startOfMonth),
                    'intent' => 'success',
                ],
            ],
            'workspace' => [
                'accessibleCollections' => 6,
                'studentRecords' => Student::query()->count(),
                'mediaAssets' => Media::query()->count(),
                'organizationNodes' => Unit::query()->count() + Position::query()->count() + StaffAppointment::query()->count(),
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

    private function countPendingPosts(): int
    {
        return Post::query()->where('status', 'pending')->count();
    }

    private function countStaffProfilesCreatedSince(CarbonInterface $date): int
    {
        return StaffProfile::query()
            ->where('created_at', '>=', $date)
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
                    'description' => 'Cập nhật bởi '.($author instanceof User ? $author->name : 'hệ thống'),
                    'status' => $post->status,
                    'updatedAt' => $this->toIsoString($post->updated_at),
                ];
            })
            ->all();

        $staffProfileItems = StaffProfile::query()
            ->latest('updated_at')
            ->limit(3)
            ->get()
            ->map(fn (StaffProfile $profile): array => [
                'id' => 'staff-'.$profile->id,
                'kind' => 'Hồ sơ cán bộ',
                'title' => $profile->full_name,
                'description' => $profile->is_public ? 'Đang hiển thị công khai' : 'Đang được chuẩn bị',
                'status' => $profile->is_public ? 'published' : 'draft',
                'updatedAt' => $this->toIsoString($profile->updated_at),
            ])
            ->all();

        /** @var Collection<int, array{id: string, kind: string, title: string, description: string, status: string, updatedAt: string}> $items */
        $items = collect(array_merge($postItems, $staffProfileItems))
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
