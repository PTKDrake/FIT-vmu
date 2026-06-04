<?php

declare(strict_types=1);

namespace App\Actions\SiteLayout;

use App\Models\SiteLayout;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\DB;

class UpdateSiteLayoutStatusAction
{
    public function __invoke(SiteLayout $siteLayout, string $status): SiteLayout
    {
        return DB::transaction(function () use ($siteLayout, $status): SiteLayout {
            if ($status !== 'published' && SiteSetting::isDefaultForAnyType($siteLayout)) {
                throw new \DomainException('Layout mặc định phải ở trạng thái đã xuất bản.');
            }

            $siteLayout->update(['status' => $status]);

            return $siteLayout->fresh() ?? $siteLayout;
        });
    }
}
