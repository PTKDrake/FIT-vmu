<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Media;
use App\Models\Page;
use App\Models\SiteLayout;
use App\Rules\ReservedPageSlug;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StorePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Page::class) ?? false;
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

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique((new Page)->getTable(), 'slug'),
                new ReservedPageSlug,
            ],
            'excerpt' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'content_format' => ['required', 'string', Rule::in(['puck_json'])],
            'site_layout_id' => ['nullable', 'integer', Rule::exists((new SiteLayout)->getTable(), 'id')],
            'thumbnail_id' => ['nullable', 'integer', Rule::exists((new Media)->getTable(), 'id')],
            'status' => ['required', 'string', Rule::in(['draft', 'pending'])],
        ];
    }
}
