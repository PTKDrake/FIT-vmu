<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Document;
use App\Models\User;

class DocumentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view documents') || $user->can('view own documents');
    }

    public function view(User $user, Document $document): bool
    {
        if ($this->canManageDocument($user, $document) || $this->ownsDocument($user, $document)) {
            return true;
        }

        if ($document->status !== 'published') {
            return false;
        }

        return match ($document->visibility) {
            'public', 'login_required' => true,
            'students', 'student_code' => $user->can('view student scoped documents'),
            'staff', 'private' => $user->can('download restricted documents'),
            default => false,
        };
    }

    public function create(User $user): bool
    {
        return $user->can('create documents') || $user->can('create own documents');
    }

    public function update(User $user, Document $document): bool
    {
        return $user->can('update documents')
            || ($this->ownsDocument($user, $document) && $user->can('update own documents'));
    }

    public function delete(User $user, Document $document): bool
    {
        return $user->can('delete documents')
            || ($this->ownsDocument($user, $document) && $user->can('delete own documents'));
    }

    public function review(User $user, Document $document): bool
    {
        return $user->can('review documents');
    }

    public function publish(User $user, Document $document): bool
    {
        return $user->can('publish documents');
    }

    public function download(User $user, Document $document): bool
    {
        if ($this->canManageDocument($user, $document) || $this->ownsDocument($user, $document)) {
            return true;
        }

        if ($document->status !== 'published') {
            return false;
        }

        return match ($document->visibility) {
            'public', 'login_required' => true,
            'students', 'student_code' => $user->can('view student scoped documents'),
            'staff', 'private' => $user->can('download restricted documents'),
            default => false,
        };
    }

    public function restore(User $user, Document $document): bool
    {
        return $this->delete($user, $document);
    }

    public function forceDelete(User $user, Document $document): bool
    {
        return $this->delete($user, $document);
    }

    private function canManageDocument(User $user, Document $document): bool
    {
        return $user->can('update documents')
            || $user->can('delete documents')
            || $user->can('publish documents')
            || $user->can('review documents');
    }

    private function ownsDocument(User $user, Document $document): bool
    {
        return $document->owner_id === $user->getKey();
    }
}
