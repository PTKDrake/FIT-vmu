<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Data\SiteLayoutData;
use App\Http\Controllers\Controller;
use App\Models\SiteLayout;
use Carbon\CarbonInterface;
use Inertia\Response;

final class SiteLayoutsIndexController extends Controller
{
    public function __invoke(): Response
    {
        $layouts = SiteLayout::query()
            ->withCount('pages')
            ->latest()
            ->get()
            ->map(fn (SiteLayout $siteLayout): array => $this->mapLayout(SiteLayoutData::fromModel($siteLayout)))
            ->values()
            ->all();

        return inertia('cms/layouts/index', [
            'layouts' => $layouts,
        ]);
    }

    /**
     * @return array{
     *     id: int,
     *     name: string,
     *     key: string,
     *     status: string,
     *     isDefault: bool,
     *     pagesCount: int,
     *     updatedAt: string
     * }
     */
    private function mapLayout(SiteLayoutData $siteLayout): array
    {
        return [
            'id' => (int) $siteLayout->id,
            'name' => $siteLayout->name,
            'key' => $siteLayout->key,
            'status' => $siteLayout->status,
            'isDefault' => $siteLayout->isDefault,
            'pagesCount' => $siteLayout->pagesCount,
            'updatedAt' => $this->formatDateTime($siteLayout->updatedAt) ?? now()->toAtomString(),
        ];
    }

    private function formatDateTime(mixed $value): ?string
    {
        if ($value instanceof CarbonInterface) {
            return $value->toAtomString();
        }

        if (is_string($value) && $value !== '') {
            return $value;
        }

        return null;
    }
}
