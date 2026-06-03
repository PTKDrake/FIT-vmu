<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Puck\BuildPuckDynamicDataAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

final class LayoutBuilderSourceOptionsController extends Controller
{
    /** @var list<string> */
    private const ALLOWED_SOURCES = [
        'navigation-menus',
        'posts',
        'categories',
        'staff',
        'units',
        'pages',
    ];

    public function __invoke(string $source, BuildPuckDynamicDataAction $buildPuckDynamicData): JsonResponse
    {
        abort_unless(in_array($source, self::ALLOWED_SOURCES, true), 404);

        $data = $buildPuckDynamicData();

        return response()->json([
            'data' => match ($source) {
                'navigation-menus' => $this->options($data['navigationMenus'], 'name'),
                'posts' => $this->options($data['posts'], 'title'),
                'categories' => $this->options($data['categories'], 'name'),
                'staff' => $this->options($data['staff'], 'name'),
                'units' => $this->options($data['units'], 'name'),
                'pages' => $this->options($data['pages'], 'title'),
            },
        ]);
    }

    /**
     * @param  list<array<string, mixed>>  $records
     * @return list<array{id: int, label: string, meta: array<string, mixed>}>
     */
    private function options(array $records, string $labelKey): array
    {
        return array_values(collect($records)
            ->map(function (array $record) use ($labelKey): ?array {
                $id = $record['id'] ?? null;
                $label = $record[$labelKey] ?? null;

                if (! is_int($id) || ! is_string($label)) {
                    return null;
                }

                return [
                    'id' => $id,
                    'label' => $label,
                    'meta' => $record,
                ];
            })
            ->filter()
            ->all());
    }
}
