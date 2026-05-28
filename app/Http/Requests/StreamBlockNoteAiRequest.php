<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StreamBlockNoteAiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('view admin dashboard') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'id' => ['nullable', 'string', 'max:191'],
            'messageId' => ['nullable', 'string', 'max:191'],
            'messages' => ['required', 'array', 'min:1'],
            'toolDefinitions' => ['required', 'array', 'min:1'],
            'trigger' => ['nullable', 'string', 'max:64'],
        ];
    }
}
