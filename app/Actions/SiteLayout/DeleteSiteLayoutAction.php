<?php

declare(strict_types=1);

namespace App\Actions\SiteLayout;

use App\Models\SiteLayout;
use Illuminate\Support\Facades\DB;

class DeleteSiteLayoutAction
{
    public function __invoke(SiteLayout $siteLayout): void
    {
        DB::transaction(function () use ($siteLayout): void {
            if ($siteLayout->is_default) {
                throw new \DomainException('Không thể xóa layout mặc định.');
            }

            if ($siteLayout->pages()->exists()) {
                throw new \DomainException('Không thể xóa layout đang được trang sử dụng.');
            }

            $siteLayout->delete();
        });
    }
}
