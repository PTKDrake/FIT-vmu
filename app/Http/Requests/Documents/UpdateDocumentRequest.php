<?php

declare(strict_types=1);

namespace App\Http\Requests\Documents;

use App\Data\DocumentData;
use App\Models\Document;
use App\Models\Media;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDocumentRequest extends FormRequest
{
    /**
     * @var list<string>
     */
    private const ALLOWED_TYPES = [
        'lecture',
        'exercise',
        'exam',
        'form',
        'score',
        'announcement',
        'other',
    ];

    /**
     * @var list<string>
     */
    private const ALLOWED_VISIBILITIES = [
        'public',
        'login_required',
        'students',
        'staff',
        'private',
        'student_code',
    ];

    /**
     * @var list<string>
     */
    private const ALLOWED_STATUSES = [
        'draft',
        'pending',
        'published',
        'rejected',
    ];

    /**
     * @var list<string>
     */
    private const ALLOWED_MODES = [
        'file',
        'preview',
        'student_table',
    ];

    public function authorize(): bool
    {
        $document = $this->routeDocument();

        if ($document === null) {
            return false;
        }

        return $this->user()?->can('update', $document) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<int, ValidationRule|string>|string>
     */
    public function rules(): array
    {
        $document = $this->routeDocument();

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique(Document::class, 'slug')->ignore($document)],
            'description' => ['nullable', 'string'],
            'description_format' => ['required', 'string', 'max:50', Rule::in(['blocknote_json'])],
            'file_id' => ['nullable', 'integer', Rule::exists((new Media)->getTable(), 'id')],
            'document_type' => ['required', 'string', Rule::in(self::ALLOWED_TYPES)],
            'visibility' => ['required', 'string', Rule::in(self::ALLOWED_VISIBILITIES)],
            'status' => ['required', 'string', Rule::in(self::ALLOWED_STATUSES)],
            'document_mode' => ['required', 'string', Rule::in(self::ALLOWED_MODES)],
            'published_at' => ['nullable', 'date'],
        ];
    }

    public function toDto(): DocumentData
    {
        $document = $this->routeDocument();

        return DocumentData::from([
            'id' => $document?->id,
            'title' => $this->validated('title'),
            'slug' => $this->validated('slug'),
            'description' => $this->validated('description'),
            'descriptionFormat' => $this->validated('description_format'),
            'fileId' => $this->validated('file_id'),
            'ownerId' => $document?->owner_id,
            'documentType' => $this->validated('document_type'),
            'visibility' => $this->validated('visibility'),
            'status' => $this->validated('status'),
            'documentMode' => $this->validated('document_mode'),
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
