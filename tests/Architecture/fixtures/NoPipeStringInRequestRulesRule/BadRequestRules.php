<?php

declare(strict_types=1);

namespace Tests\Architecture\fixtures\NoPipeStringInRequestRulesRule;

use Illuminate\Foundation\Http\FormRequest;

final class BadRequestRules extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => [
                'required|string|max:255',
            ],
            'email' => [
                'required',
                'email|max:255',
            ],
        ];
    }
}
