<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Unit;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class ReorderUnitsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage units') ?? false;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'nodes' => ['required', 'array', 'min:1'],
            'nodes.*.id' => ['required', 'integer', 'distinct', Rule::exists((new Unit)->getTable(), 'id')],
            'nodes.*.sort_order' => ['required', 'integer', 'min:0'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            /** @var array<int, array{id: int, sort_order: int}> $nodes */
            $nodes = $this->array('nodes');

            if ($nodes === []) {
                return;
            }

            $nodeIds = collect($nodes)
                ->map(static fn (array $node): int => $node['id'])
                ->all();
            /** @var list<int> $currentIds */
            $currentIds = Unit::query()
                ->get(['id'])
                ->map(static function (Unit $unit): int {
                    /** @var int $unitId */
                    $unitId = $unit->getKey();

                    return $unitId;
                })
                ->all();

            sort($nodeIds);
            sort($currentIds);

            if ($nodeIds !== $currentIds) {
                $validator->errors()->add('nodes', 'Dữ liệu sắp xếp không khớp với danh sách đơn vị hiện tại.');
            }

        });
    }
}
