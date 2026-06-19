<?php

declare(strict_types=1);

use App\Support\PuckComponentTypeNormalizer;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $this->normalizePages();
        $this->normalizeSiteLayouts();
    }

    public function down(): void
    {
        // Canonical component keys are intentionally irreversible.
    }

    private function normalizePages(): void
    {
        DB::table('pages')
            ->select(['id', 'content'])
            ->orderBy('id')
            ->each(function (object $page): void {
                $normalizedContent = PuckComponentTypeNormalizer::normalizeJson($page->content);

                if ($normalizedContent === null || $normalizedContent === $page->content) {
                    return;
                }

                DB::table('pages')
                    ->where('id', $page->id)
                    ->update(['content' => $normalizedContent]);
            });
    }

    private function normalizeSiteLayouts(): void
    {
        DB::table('site_layouts')
            ->select(['id', 'header_data', 'footer_data', 'left_data', 'right_data'])
            ->orderBy('id')
            ->each(function (object $layout): void {
                $updates = [];

                foreach (['header_data', 'footer_data', 'left_data', 'right_data'] as $column) {
                    $normalizedValue = PuckComponentTypeNormalizer::normalizeJson($layout->{$column});

                    if ($normalizedValue === $layout->{$column}) {
                        continue;
                    }

                    $updates[$column] = $normalizedValue;
                }

                if ($updates === []) {
                    return;
                }

                DB::table('site_layouts')
                    ->where('id', $layout->id)
                    ->update($updates);
            });
    }
};
