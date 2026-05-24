<?php

declare(strict_types=1);

namespace App\Http\Requests\Documents;

use App\Data\DocumentData;
use App\Models\Document;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PublishDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $document = $this->routeDocument();

        if ($document === null) {
            return false;
        }

        return $this->user()?->can('publish', $document) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<int, ValidationRule|string>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', 'string', Rule::in(['published'])],
            'published_at' => ['required', 'date'],
        ];
    }

    public function toDto(): DocumentData
    {
        $document = $this->routeDocument();

        return DocumentData::from([
            'id' => $document?->id,
            'title' => $document?->title,
            'slug' => $document?->slug,
            'description' => $document?->description,
            'descriptionFormat' => $document?->description_format,
            'fileId' => $document?->file_id,
            'ownerId' => $document?->owner_id,
            'documentType' => $document?->document_type,
            'visibility' => $document?->visibility,
            'status' => $this->validated('status'),
            'documentMode' => $document?->document_mode,
            'publishedAt' => $this->validated('published_at'),
            'createdAt' => $document?->created_at?->toIso8601String(),
            'updatedAt' => $document?->updated_at?->toIso8601String(),
        ]);
    }

    private function routeDocument(): ?Document
    {
        $document = $this->route('document');

        return $document instanceof Document ? $document : null;
    }
}
