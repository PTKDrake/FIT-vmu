<?php

declare(strict_types=1);

namespace Tests\Architecture\fixtures\NoRequestInputGetRule;

use Illuminate\Http\Request;

final class BadRequestInputGetUsage
{
    public function fromRequest(Request $request): array
    {
        return [
            'name' => $request->input('name'),
            'email' => $request->get('email'),
        ];
    }

    public function nested(Request $request): array
    {
        $data = [];

        if ($request->has('filters')) {
            $data['filters'] = [
                'status' => $request->input('filters.status'),
                'direction' => $request->get('filters.direction'),
            ];
        }

        return $data;
    }
}
