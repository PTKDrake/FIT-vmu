<?php

declare(strict_types=1);

namespace App\Http\Requests\Posts;

use App\Data\PostData;
use App\Models\Media;
use App\Models\Post;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePostRequest extends FormRequest
{
    /**
     * @var list<string>
     */
    private const ALLOWED_STATUSES = [
        'draft',
        'pending',
        'published',
        'rejected',
    ];

    public function authorize(): bool
    {
        return $this->user()?->can('create', Post::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<int, ValidationRule|string>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique(Post::class, 'slug')],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'content_format' => ['required', 'string', 'max:50', Rule::in(['blocknote_json'])],
            'thumbnail_id' => ['nullable', 'integer', Rule::exists((new Media)->getTable(), 'id')],
            'status' => ['required', 'string', Rule::in(self::ALLOWED_STATUSES)],
            'published_at' => ['nullable', 'date'],
        ];
    }

    public function toDto(): PostData
    {
        return PostData::from([
            'id' => null,
            'title' => $this->validated('title'),
            'slug' => $this->validated('slug'),
            'excerpt' => $this->validated('excerpt'),
            'content' => $this->validated('content'),
            'contentFormat' => $this->validated('content_format'),
            'thumbnailId' => $this->validated('thumbnail_id'),
            'authorId' => $this->user()?->id,
            'status' => $this->validated('status'),
            'publishedAt' => $this->validated('published_at'),
            'createdAt' => null,
            'updatedAt' => null,
        ]);
    }
}
