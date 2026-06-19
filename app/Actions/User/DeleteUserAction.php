<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use RuntimeException;

class DeleteUserAction
{
    public function __invoke(User $actor, User $user): void
    {
        if ($actor->is($user)) {
            throw new AuthorizationException('You cannot delete your own account from the CMS user list.');
        }

        if ($user->hasRole('super-admin') && ! $actor->hasRole('super-admin')) {
            throw new AuthorizationException('You are not authorized to delete a super-admin account.');
        }

        if (
            $user->authoredPosts()->exists()
            || $user->authoredPages()->exists()
            || $user->uploadedMedia()->exists()
        ) {
            throw new RuntimeException('Không thể xóa người dùng này vì tài khoản còn liên kết với nội dung hoặc media.');
        }

        $user->delete();
    }
}
