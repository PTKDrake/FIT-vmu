<?php

declare(strict_types=1);

namespace App\Actions\SiteLayout;

use App\Models\SiteLayout;
use Illuminate\Support\Facades\DB;

class SetDefaultSiteLayoutAction
{
    public function __invoke(SiteLayout $siteLayout): SiteLayout
    {
        return DB::transaction(function () use ($siteLayout): SiteLayout {
            SiteLayout::query()
                ->whereKeyNot($siteLayout->getKey())
                ->update(['is_default' => false]);

            $siteLayout->update([
                'status' => 'published',
                'is_default' => true,
            ]);

            return $siteLayout->fresh() ?? $siteLayout;
        });
    }
}
