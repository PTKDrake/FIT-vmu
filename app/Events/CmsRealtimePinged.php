<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CmsRealtimePinged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $userId,
        public string $message,
        public string $sentAt,
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('cms-user.'.$this->userId),
        ];
    }

    /**
     * @return array{
     *     message: string,
     *     user_id: int,
     *     sent_at: string
     * }
     */
    public function broadcastWith(): array
    {
        return [
            'message' => $this->message,
            'user_id' => $this->userId,
            'sent_at' => $this->sentAt,
        ];
    }
}
