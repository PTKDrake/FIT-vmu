<?php

declare(strict_types=1);

namespace App\Actions\SiteLayout;

use App\Models\SiteLayout;
use Illuminate\Support\Facades\DB;

class CloneSiteLayoutAction
{
    public function __invoke(SiteLayout $siteLayout): SiteLayout
    {
        return DB::transaction(function () use ($siteLayout): SiteLayout {
            $clone = $siteLayout->replicate([
                'created_at',
                'updated_at',
            ]);

            $clone->name = sprintf('%s (Bản sao)', $siteLayout->name);
            $clone->key = $this->generateUniqueKey($siteLayout->key);
            $clone->save();

            return $clone->fresh() ?? $clone;
        });
    }

    private function generateUniqueKey(string $baseKey): string
    {
        $suffix = '-ban-sao';
        $candidate = $baseKey.$suffix;
        $counter = 2;

        while (SiteLayout::query()->where('key', $candidate)->exists()) {
            $candidate = sprintf('%s%s-%d', $baseKey, $suffix, $counter);
            $counter++;
        }

        return $candidate;
    }
}
