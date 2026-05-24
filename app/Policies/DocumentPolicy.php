<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Document;
use App\Models\User;

class DocumentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view documents')
            || $user->can('view own documents')
            || $user->can('view student scoped documents')
            || $user->can('view own personalized documents');
    }

    public function view(User $user, Document $document): bool
    {
        if ($this->ownsDocument($user, $document) && $user->can('view own documents')) {
            return true;
        }

        if (in_array($document->visibility, ['public', 'login_required'], true)) {
            return $user->can('view documents');
        }

        if ($document->visibility === 'students' && $user->can('view student scoped documents')) {
            return true;
        }

        if ($document->visibility === 'student_code' && $user->can('view own personalized documents')) {
            return true;
        }

        return $user->can('download restricted documents');
    }

    public function download(User $user, Document $document): bool
    {
        if (! $this->view($user, $document)) {
            return false;
        }

        if (in_array($document->visibility, ['public', 'login_required'], true)) {
            return true;
        }

        if ($this->ownsDocument($user, $document)) {
            return true;
        }

        return $user->can('download restricted documents');
    }

    public function create(User $user): bool
    {
        return $user->can('create documents')
            || $user->can('create own documents');
    }

    public function update(User $user, Document $document): bool
    {
        if ($user->can('update documents')) {
            return true;
        }

        return $this->ownsDocument($user, $document) && $user->can('update own documents');
    }

    public function delete(User $user, Document $document): bool
    {
        if ($user->can('delete documents')) {
            return true;
        }

        return $this->ownsDocument($user, $document) && $user->can('delete own documents');
    }

    public function publish(User $user, Document $document): bool
    {
        return $user->can('publish documents');
    }

    public function review(User $user, Document $document): bool
    {
        return $user->can('review documents');
    }

    private function ownsDocument(User $user, Document $document): bool
    {
        return $document->owner_id === $user->id;
    }
}
