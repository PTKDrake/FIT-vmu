<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Inertia\Response;

final class UnitEditPageController extends Controller
{
    public function __invoke(Unit $unit): Response
    {
        return inertia('cms/units/edit', [
            'unit' => [
                'id' => $unit->getKey(),
                'name' => $unit->name,
                'slug' => $unit->slug,
                'description' => $unit->description,
                'descriptionFormat' => $unit->description_format,
                'sortOrder' => $unit->sort_order,
                'isActive' => $unit->is_active,
            ],
        ]);
    }
}
