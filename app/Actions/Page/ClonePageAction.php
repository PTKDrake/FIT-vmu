<?php

declare(strict_types=1);

namespace App\Actions\Page;

use App\Actions\Content\SyncContentStudentGroupsAction;
use App\Events\CmsContentChanged;
use App\Models\Page;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ClonePageAction
{
    public function __construct(
        private readonly SyncContentStudentGroupsAction $syncContentStudentGroups,
    ) {}

    public function __invoke(Page $page, User $author): Page
    {
        return DB::transaction(function () use ($page, $author): Page {
            $clone = $page->replicate([
                'published_at',
                'created_at',
                'updated_at',
            ]);
            /** @var positive-int $authorId */
            $authorId = $author->getKey();

            $clone->title = sprintf('%s (Bản sao)', $page->title);
            $clone->slug = $this->generateUniqueSlug($page->slug);
            $clone->author_id = $authorId;
            $clone->status = 'draft';
            $clone->published_at = null;
            $clone->save();

            ($this->syncContentStudentGroups)($clone, $page->studentGroupIds());

            event(CmsContentChanged::forPage($clone, 'cloned', 'Đã sao chép trang.'));

            return $clone->fresh(['author']) ?? $clone;
        });
    }

    private function generateUniqueSlug(string $baseSlug): string
    {
        $suffix = '-ban-sao';
        $candidate = $baseSlug.$suffix;
        $counter = 2;

        while (Page::query()->where('slug', $candidate)->exists()) {
            $candidate = sprintf('%s%s-%d', $baseSlug, $suffix, $counter);
            $counter++;
        }

        return $candidate;
    }
}
