<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Page;
use App\Rules\ReservedPageSlug;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdatePageMetadataRequest extends FormRequest
{
    private const TEMPLATE_KEYS = ['default', 'landing', 'fullwidth', 'blank', 'sidebar-right'];

    public function authorize(): bool
    {
        $page = $this->route('page');

        return $page instanceof Page
            ? $this->user()?->can('update', $page) ?? false
            : false;
    }

    protected function prepareForValidation(): void
    {
        $title = trim($this->string('title')->toString());
        $slug = trim($this->string('slug')->toString(), " \t\n\r\0\x0B/");

        if ($slug === '' && $title !== '') {
            $this->merge([
                'slug' => Str::slug($title),
            ]);

            return;
        }

        if ($slug !== '') {
            $this->merge([
                'slug' => $slug,
            ]);
        }
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        $page = $this->route('page');
        $pageId = $page instanceof Page ? $page->getKey() : null;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique((new Page)->getTable(), 'slug')->ignore($pageId),
                new ReservedPageSlug,
            ],
            'excerpt' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string'],
            'template_key' => ['sometimes', 'string', Rule::in(self::TEMPLATE_KEYS)],
            'template_data' => ['nullable', 'array'],
        ];
    }
}
