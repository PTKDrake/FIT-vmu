<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Document;
use App\Models\Media;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Document::class) ?? false;
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
                Rule::unique((new Document)->getTable(), 'slug'),
            ],
            'description' => ['nullable', 'string'],
            'description_format' => ['required', 'string', Rule::in(DocumentRequestOptions::storageFormats())],
            'file_id' => ['nullable', 'integer', Rule::exists((new Media)->getTable(), 'id')],
            'owner_id' => ['nullable', 'integer', Rule::exists((new User)->getTable(), 'id')],
            'document_type' => ['required', 'string', Rule::in(DocumentRequestOptions::documentTypes())],
            'visibility' => ['required', 'string', Rule::in(DocumentRequestOptions::visibilities())],
            'status' => ['required', 'string', Rule::in(['draft', 'pending'])],
            'document_mode' => ['required', 'string', Rule::in(DocumentRequestOptions::modes())],
        ];
    }
}
