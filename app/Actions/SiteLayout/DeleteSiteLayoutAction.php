<?php

declare(strict_types=1);

namespace App\Actions\SiteLayout;

use App\Models\Post;
use App\Models\PostCategory;
use App\Models\SiteLayout;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\DB;

class DeleteSiteLayoutAction
{
    public function __invoke(SiteLayout $siteLayout): void
    {
        DB::transaction(function () use ($siteLayout): void {
            if (SiteSetting::isDefaultForAnyType($siteLayout)) {
                throw new \DomainException('Không thể xóa layout đang được đặt làm mặc định.');
            }

            if (
                $siteLayout->pages()->exists()
                || PostCategory::query()->where('site_layout_id', $siteLayout->getKey())->exists()
                || Post::query()->where('site_layout_id', $siteLayout->getKey())->exists()
            ) {
                throw new \DomainException('Không thể xóa layout đang được nội dung sử dụng.');
            }

            $siteLayout->delete();
        });
    }
}
