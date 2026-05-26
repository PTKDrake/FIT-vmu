<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\PostCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePostCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', PostCategory::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique((new PostCategory)->getTable(), 'slug')],
            'description' => ['nullable', 'string'],
            'parent_id' => [
                'nullable',
                'integer',
                Rule::exists((new PostCategory)->getTable(), 'id'),
            ],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
