<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\PostCategory;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        $postCategory = $this->route('post_category');

        return $postCategory instanceof PostCategory
            ? $this->user()?->can('update', $postCategory) ?? false
            : false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $postCategory = $this->route('post_category');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique((new PostCategory)->getTable(), 'slug')->ignore($postCategory?->getKey())],
            'description' => ['nullable', 'string'],
            'parent_id' => [
                'nullable',
                'integer',
                Rule::exists((new PostCategory)->getTable(), 'id'),
                function (string $attribute, mixed $value, Closure $fail) use ($postCategory): void {
                    if ($postCategory instanceof PostCategory && $value === $postCategory->getKey()) {
                        $fail('The selected parent category is invalid.');
                    }
                },
            ],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
