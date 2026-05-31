<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Media;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class StoreMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Media::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'files' => ['required', 'array', 'min:1', 'max:10'],
            'files.*' => [
                'required',
                File::types([
                    'jpg',
                    'jpeg',
                    'png',
                    'webp',
                    'gif',
                    'mp4',
                    'webm',
                    'mov',
                    'mp3',
                    'wav',
                    'm4a',
                    'ogg',
                ])->max(20 * 1024),
            ],
        ];
    }
}
