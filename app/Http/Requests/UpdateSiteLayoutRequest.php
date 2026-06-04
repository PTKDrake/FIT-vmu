<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\SiteLayout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateSiteLayoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        $siteLayout = $this->route('siteLayout');

        return $siteLayout instanceof SiteLayout
            ? $this->user()?->can('update', $siteLayout) ?? false
            : false;
    }

    protected function prepareForValidation(): void
    {
        $name = trim($this->string('name')->toString());
        $key = trim($this->string('key')->toString(), " \t\n\r\0\x0B/");

        if ($key === '' && $name !== '') {
            $this->merge(['key' => Str::slug($name)]);

            return;
        }

        if ($key !== '') {
            $this->merge(['key' => Str::slug($key)]);
        }
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        $siteLayout = $this->route('siteLayout');
        $siteLayoutId = $siteLayout instanceof SiteLayout ? $siteLayout->getKey() : null;

        return [
            'name' => ['required', 'string', 'max:255'],
            'key' => ['required', 'string', 'max:255', Rule::unique((new SiteLayout)->getTable(), 'key')->ignore($siteLayoutId)],
            'header_data' => ['nullable', 'string'],
            'footer_data' => ['nullable', 'string'],
            'left_data' => ['nullable', 'string'],
            'right_data' => ['nullable', 'string'],
            'status' => ['required', 'string', Rule::in(['draft', 'published'])],
        ];
    }

    /** @return array<int, callable(Validator): void> */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                foreach (['header_data', 'footer_data', 'left_data', 'right_data'] as $field) {
                    $this->validatePuckSlot($validator, $field);
                }
            },
        ];
    }

    private function validatePuckSlot(Validator $validator, string $field): void
    {
        $value = $this->string($field)->toString();

        if ($value === '') {
            return;
        }

        try {
            $decoded = json_decode($value, true, flags: JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            $validator->errors()->add($field, 'Dữ liệu Puck không hợp lệ.');

            return;
        }

        if (! is_array($decoded) || ! array_key_exists('content', $decoded) || ! is_array($decoded['content'])) {
            $validator->errors()->add($field, 'Dữ liệu Puck phải có trường content dạng mảng.');
        }
    }
}
