<?php

declare(strict_types=1);

namespace App\Actions\SiteLayout;

use App\Models\SiteLayout;
use App\Models\SiteSetting;

class SetDefaultSiteLayoutAction
{
    public function __invoke(SiteLayout $siteLayout, string $type): void
    {
        $key = SiteSetting::layoutKeyForType($type);

        if ($key === null) {
            throw new \DomainException("Loại layout '{$type}' không hợp lệ.");
        }

        SiteSetting::set($key, $siteLayout->getKey());
    }
}
