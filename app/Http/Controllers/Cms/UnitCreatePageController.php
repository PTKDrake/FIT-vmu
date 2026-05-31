<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Inertia\Response;

final class UnitCreatePageController extends Controller
{
    public function __invoke(): Response
    {
        $maxSortOrder = Unit::query()->max('sort_order');

        return inertia('cms/units/create', [
            'unit' => [
                'id' => null,
                'name' => '',
                'slug' => '',
                'description' => null,
                'descriptionFormat' => 'blocknote_json',
                'sortOrder' => is_numeric($maxSortOrder) ? ((int) $maxSortOrder + 1) : 1,
                'isActive' => true,
            ],
        ]);
    }
}
