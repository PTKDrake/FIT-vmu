<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Media;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RenameMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        $media = $this->route('media');

        return $media instanceof Media
            && ($this->user()?->can('update', $media) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:1', 'max:180'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $name = trim($this->string('name')->toString());
        $media = $this->route('media');

        if ($media instanceof Media) {
            $extension = pathinfo($media->display_name, PATHINFO_EXTENSION);
            $extensionSuffix = $extension !== '' ? '.'.$extension : '';

            if (
                $extensionSuffix !== ''
                && strtolower(substr($name, -strlen($extensionSuffix))) === strtolower($extensionSuffix)
            ) {
                $name = substr($name, 0, -strlen($extensionSuffix));
            }

            $name = rtrim($name, " \t\n\r\0\x0B.");
        }

        $this->merge([
            'name' => $name,
        ]);
    }
}
