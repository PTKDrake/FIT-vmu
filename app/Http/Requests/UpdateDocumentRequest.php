<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Document;
use App\Models\Media;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $document = $this->route('document');

        return $document instanceof Document
            ? $this->user()?->can('update', $document) ?? false
            : false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $document = $this->route('document');
        $documentId = $document instanceof Document ? $document->getKey() : null;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique((new Document)->getTable(), 'slug')->ignore($documentId),
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
