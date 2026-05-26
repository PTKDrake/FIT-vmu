<?php

declare(strict_types=1);

namespace App\Actions\Page;

use App\Models\Page;
use Illuminate\Support\Facades\DB;

class DeletePageAction
{
    public function __invoke(Page $page): void
    {
        DB::transaction(function () use ($page): void {
            $page->delete();
        });
    }
}
