<?php

declare(strict_types=1);

namespace App\Actions\Realtime;

use App\Events\CmsRealtimePinged;
use App\Models\User;

class DispatchCmsRealtimePingAction
{
    /**
     * @return array{
     *     message: string,
     *     user_id: int,
     *     sent_at: string
     * }
     */
    public function __invoke(User $user): array
    {
        /** @var int $userId */
        $userId = $user->getKey();

        $payload = [
            'message' => sprintf('Realtime ping từ CMS đã được gửi cho %s.', $user->name),
            'user_id' => $userId,
            'sent_at' => now()->toIso8601String(),
        ];

        CmsRealtimePinged::dispatch(
            userId: $payload['user_id'],
            message: $payload['message'],
            sentAt: $payload['sent_at'],
        );

        return $payload;
    }
}
