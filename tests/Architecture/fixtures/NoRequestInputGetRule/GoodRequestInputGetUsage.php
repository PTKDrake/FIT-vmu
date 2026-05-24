<?php

declare(strict_types=1);

namespace Tests\Architecture\fixtures\NoRequestInputGetRule;

use ArrayObject;
use Illuminate\Http\Request;

final class GoodRequestInputGetUsage
{
    public function fromRequest(Request $request): array
    {
        return [
            'name' => $request->string('name')->toString(),
            'remember' => $request->boolean('remember'),
            'filters' => $request->array('filters'),
        ];
    }

    public function unrelatedGetter(ArrayObject $value): mixed
    {
        return $value->getArrayCopy();
    }
}
