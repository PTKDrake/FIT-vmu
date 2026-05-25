<?php

declare(strict_types=1);

namespace App\Actions\Dashboard;

use App\Models\Document;
use App\Models\Media;
use App\Models\Position;
use App\Models\Post;
use App\Models\StaffAppointment;
use App\Models\StaffProfile;
use App\Models\Student;
use App\Models\Unit;
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
     *     }>,
     *     recentDocuments: list<array{
     *         id: string,
     *         title: string,
     *         documentType: string,
     *         visibility: string,
     *         status: string,
     *         updatedAt: string
     *     }>
     * }
     */
    public function __invoke(): array
    {
        $startOfMonth = now()->startOfMonth();

        $publishedPostsCount = Post::query()->where('status', 'published')->count();
        $publicDocumentsCount = Document::query()
            ->where('status', 'published')
            ->where('visibility', 'public')
            ->count();
        $pendingDocumentsCount = Document::query()->where('status', 'pending')->count();
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
                    'key' => 'documents',
                    'label' => 'Tài liệu công khai',
                    'value' => $publicDocumentsCount,
                    'helper' => $this->countPublishedDocumentsByVisibility('login_required').' tài liệu cần đăng nhập',
                    'change' => $this->countDocumentsCreatedSince($startOfMonth),
                    'intent' => 'info',
                ],
                [
                    'key' => 'pending',
                    'label' => 'Tài liệu chờ duyệt',
                    'value' => $pendingDocumentsCount,
                    'helper' => $this->countPendingPosts().' bài viết đang chờ biên tập',
                    'change' => $pendingDocumentsCount,
                    'intent' => 'warning',
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
                'accessibleCollections' => 7,
                'studentRecords' => Student::query()->count(),
                'mediaAssets' => Media::query()->count(),
                'organizationNodes' => Unit::query()->count() + Position::query()->count() + StaffAppointment::query()->count(),
            ],
            'recentActivity' => $this->recentActivity(),
            'pendingReview' => $this->pendingReviewItems(),
            'recentDocuments' => $this->recentDocuments(),
        ];
    }

    private function countPostsPublishedSince(CarbonInterface $date): int
    {
        return Post::query()
            ->where('status', 'published')
            ->where('published_at', '>=', $date)
            ->count();
    }

    private function countDocumentsCreatedSince(CarbonInterface $date): int
    {
        return Document::query()
            ->where('created_at', '>=', $date)
            ->count();
    }

    private function countPendingPosts(): int
    {
        return Post::query()->where('status', 'pending')->count();
    }

    private function countPublishedDocumentsByVisibility(string $visibility): int
    {
        return Document::query()
            ->where('status', 'published')
            ->where('visibility', $visibility)
            ->count();
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
        /** @var Collection<int, array{id: string, kind: string, title: string, description: string, status: string, updatedAt: string}> $items */
        $items = collect()
            ->concat(
                Post::query()
                    ->with('author:id,name')
                    ->latest('updated_at')
                    ->limit(4)
                    ->get()
                    ->map(fn (Post $post): array => [
                        'id' => 'post-'.$post->id,
                        'kind' => 'Bài viết',
                        'title' => $post->title,
                        'description' => 'Cập nhật bởi '.($post->author?->name ?? 'hệ thống'),
                        'status' => $post->status,
                        'updatedAt' => $this->toIsoString($post->updated_at),
                    ])
            )
            ->concat(
                Document::query()
                    ->with('owner:id,name')
                    ->latest('updated_at')
                    ->limit(4)
                    ->get()
                    ->map(fn (Document $document): array => [
                        'id' => 'document-'.$document->id,
                        'kind' => 'Tài liệu',
                        'title' => $document->title,
                        'description' => 'Chủ sở hữu: '.($document->owner?->name ?? 'hệ thống'),
                        'status' => $document->status,
                        'updatedAt' => $this->toIsoString($document->updated_at),
                    ])
            )
            ->concat(
                StaffProfile::query()
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
            )
            ->sortByDesc('updatedAt')
            ->take(8)
            ->values();

        return $items->all();
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
        /** @var Collection<int, array{id: string, kind: string, title: string, owner: string, status: string, updatedAt: string}> $items */
        $items = collect()
            ->concat(
                Post::query()
                    ->with('author:id,name')
                    ->where('status', 'pending')
                    ->latest('updated_at')
                    ->limit(4)
                    ->get()
                    ->map(fn (Post $post): array => [
                        'id' => 'post-pending-'.$post->id,
                        'kind' => 'Bài viết',
                        'title' => $post->title,
                        'owner' => $post->author?->name ?? 'Hệ thống',
                        'status' => $post->status,
                        'updatedAt' => $this->toIsoString($post->updated_at),
                    ])
            )
            ->concat(
                Document::query()
                    ->with('owner:id,name')
                    ->where('status', 'pending')
                    ->latest('updated_at')
                    ->limit(4)
                    ->get()
                    ->map(fn (Document $document): array => [
                        'id' => 'document-pending-'.$document->id,
                        'kind' => 'Tài liệu',
                        'title' => $document->title,
                        'owner' => $document->owner?->name ?? 'Hệ thống',
                        'status' => $document->status,
                        'updatedAt' => $this->toIsoString($document->updated_at),
                    ])
            )
            ->sortByDesc('updatedAt')
            ->take(6)
            ->values();

        return $items->all();
    }

    /**
     * @return list<array{
     *     id: string,
     *     title: string,
     *     documentType: string,
     *     visibility: string,
     *     status: string,
     *     updatedAt: string
     * }>
     */
    private function recentDocuments(): array
    {
        return Document::query()
            ->latest('updated_at')
            ->limit(6)
            ->get()
            ->map(fn (Document $document): array => [
                'id' => 'document-list-'.$document->id,
                'title' => $document->title,
                'documentType' => $document->document_type,
                'visibility' => $document->visibility,
                'status' => $document->status,
                'updatedAt' => $this->toIsoString($document->updated_at),
            ])
            ->all();
    }

    private function toIsoString(?CarbonInterface $date): string
    {
        return $date?->toIso8601String() ?? now()->toIso8601String();
    }
}
