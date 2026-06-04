<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\Page;
use App\Models\Post;
use App\Models\StaffProfile;
use App\Models\Unit;
use Carbon\CarbonInterface;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class CmsContentChanged implements ShouldBroadcast, ShouldDispatchAfterCommit
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(
        public string $resource,
        public int $recordId,
        public string $title,
        public string $status,
        public string $action,
        public string $message,
        public string $updatedAt,
    ) {}

    public static function forPost(Post $post, string $action, string $message): self
    {
        return new self(
            resource: 'posts',
            recordId: self::normalizeRecordId($post->getKey()),
            title: $post->title,
            status: $post->status,
            action: $action,
            message: $message,
            updatedAt: self::toIsoString($post->updated_at),
        );
    }

    public static function forPage(Page $page, string $action, string $message): self
    {
        return new self(
            resource: 'pages',
            recordId: self::normalizeRecordId($page->getKey()),
            title: $page->title,
            status: $page->status,
            action: $action,
            message: $message,
            updatedAt: self::toIsoString($page->updated_at),
        );
    }

    public static function forStaffProfile(StaffProfile $staffProfile, string $action, string $message): self
    {
        return new self(
            resource: 'staff-profiles',
            recordId: self::normalizeRecordId($staffProfile->getKey()),
            title: $staffProfile->displayName(),
            status: $staffProfile->is_public ? 'published' : 'draft',
            action: $action,
            message: $message,
            updatedAt: self::toIsoString($staffProfile->updated_at),
        );
    }

    public static function forUnit(Unit $unit, string $action, string $message): self
    {
        return new self(
            resource: 'units',
            recordId: self::normalizeRecordId($unit->getKey()),
            title: $unit->name,
            status: $unit->is_active ? 'active' : 'inactive',
            action: $action,
            message: $message,
            updatedAt: self::toIsoString($unit->updated_at),
        );
    }

    /**
     * @return array<int, PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('cms.'.$this->resource),
        ];
    }

    public function broadcastAs(): string
    {
        return 'CmsContentChanged';
    }

    /**
     * @return array{
     *     action: string,
     *     message: string,
     *     record_id: int,
     *     resource: string,
     *     status: string,
     *     title: string,
     *     updated_at: string
     * }
     */
    public function broadcastWith(): array
    {
        return [
            'resource' => $this->resource,
            'record_id' => $this->recordId,
            'title' => $this->title,
            'status' => $this->status,
            'action' => $this->action,
            'message' => $this->message,
            'updated_at' => $this->updatedAt,
        ];
    }

    private static function toIsoString(?CarbonInterface $date): string
    {
        return $date?->toIso8601String() ?? now()->toIso8601String();
    }

    private static function normalizeRecordId(mixed $recordId): int
    {
        if (is_int($recordId)) {
            return $recordId;
        }

        if (is_string($recordId) && is_numeric($recordId)) {
            return (int) $recordId;
        }

        throw new \InvalidArgumentException('CMS content event requires an integer record id.');
    }
}
