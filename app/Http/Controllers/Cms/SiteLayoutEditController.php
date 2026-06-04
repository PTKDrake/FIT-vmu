<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Puck\BuildPuckDynamicDataAction;
use App\Http\Controllers\Controller;
use App\Models\SiteLayout;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Inertia\Response;

final class SiteLayoutEditController extends Controller
{
    public function __invoke(
        Request $request,
        SiteLayout $siteLayout,
        BuildPuckDynamicDataAction $buildPuckDynamicData,
    ): Response {
        return inertia('cms/layouts/edit', [
            'dynamicData' => $buildPuckDynamicData($request->user()),
            'layout' => [
                'id' => $siteLayout->getKey(),
                'name' => $siteLayout->name,
                'key' => $siteLayout->key,
                'headerData' => $siteLayout->header_data,
                'footerData' => $siteLayout->footer_data,
                'leftData' => $siteLayout->left_data,
                'rightData' => $siteLayout->right_data,
                'updatedAt' => $this->formatDateTime($siteLayout->updated_at) ?? now()->toAtomString(),
            ],
        ]);
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
