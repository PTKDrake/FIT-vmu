<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\Page;
use App\Models\Post;
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
            recordId: (int) $post->getKey(),
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
            recordId: (int) $page->getKey(),
            title: $page->title,
            status: $page->status,
            action: $action,
            message: $message,
            updatedAt: self::toIsoString($page->updated_at),
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
}
