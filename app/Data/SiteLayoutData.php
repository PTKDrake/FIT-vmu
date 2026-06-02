<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\SiteLayout;
use Carbon\CarbonInterface;

class SiteLayoutData extends Data
{
    public function __construct(
        public string $name,
        public string $key,
        public string $status,
        public bool $isDefault,
        public ?string $headerData = null,
        public ?string $footerData = null,
        public ?string $leftData = null,
        public ?string $rightData = null,
        public int $pagesCount = 0,
        public ?CarbonInterface $createdAt = null,
        public ?CarbonInterface $updatedAt = null,
        public ?int $id = null,
    ) {}

    public static function fromModel(SiteLayout $siteLayout): self
    {
        return new self(
            name: $siteLayout->name,
            key: $siteLayout->key,
            status: $siteLayout->status,
            isDefault: $siteLayout->is_default,
            headerData: $siteLayout->header_data,
            footerData: $siteLayout->footer_data,
            leftData: $siteLayout->left_data,
            rightData: $siteLayout->right_data,
            pagesCount: (int) ($siteLayout->pages_count ?? 0),
            createdAt: self::normalizeDateTime($siteLayout->created_at),
            updatedAt: self::normalizeDateTime($siteLayout->updated_at),
            id: $siteLayout->id,
        );
    }
}
