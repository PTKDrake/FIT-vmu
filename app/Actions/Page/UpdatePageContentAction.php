<?php

declare(strict_types=1);

namespace App\Actions\Page;

use App\Models\Page;
use Illuminate\Support\Facades\DB;

class UpdatePageContentAction
{
    /**
     * @param array{
     *     content: string,
     *     content_format: string
     * } $attributes
     */
    public function __invoke(Page $page, array $attributes): Page
    {
        return DB::transaction(function () use ($page, $attributes): Page {
            $page->update([
                'content' => $attributes['content'],
                'content_format' => $attributes['content_format'],
            ]);

            return $page->fresh(['author']) ?? $page;
        });
    }
}
