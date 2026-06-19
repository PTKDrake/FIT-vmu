<?php

declare(strict_types=1);

namespace App\Actions\SiteLayout;

use App\Events\CmsContentChanged;
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

        event(CmsContentChanged::forResource(
            resource: 'layouts',
            recordId: $siteLayout->getKey(),
            title: $siteLayout->name,
            status: $type,
            action: 'default-set',
            message: 'Đã đặt layout mặc định.',
            updatedAt: $siteLayout->updated_at,
        ));

        event(CmsContentChanged::forResource(
            resource: 'settings',
            recordId: $siteLayout->getKey(),
            title: $key,
            status: $type,
            action: 'updated',
            message: 'Đã cập nhật cài đặt site.',
            updatedAt: now(),
        ));
    }
}
