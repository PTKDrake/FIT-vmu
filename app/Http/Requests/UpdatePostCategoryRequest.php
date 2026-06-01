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
    private const DISPLAY_MODES = ['archive', 'landing', 'hybrid'];

    private const ARCHIVE_TEMPLATE_KEYS = ['archive-default', 'archive-landing', 'archive-featured', 'archive-sidebar'];

    private const POST_TEMPLATE_KEYS = ['article', 'news', 'announcement', 'research', 'event'];

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
        $postCategoryId = $postCategory instanceof PostCategory ? $postCategory->getKey() : null;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique((new PostCategory)->getTable(), 'slug')->ignore($postCategoryId)],
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
            'display_mode' => ['sometimes', 'string', Rule::in(self::DISPLAY_MODES)],
            'archive_template_key' => ['nullable', 'string', Rule::in(self::ARCHIVE_TEMPLATE_KEYS)],
            'archive_template_data' => ['nullable', 'array'],
            'post_template_key' => ['nullable', 'string', Rule::in(self::POST_TEMPLATE_KEYS)],
            'post_template_data' => ['nullable', 'array'],
        ];
    }
}
