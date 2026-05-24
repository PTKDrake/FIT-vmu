<?php

declare(strict_types=1);

namespace App\Http\Requests\Posts;

use App\Data\PostData;
use App\Models\Media;
use App\Models\Post;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
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
        $post = $this->routePost();

        if ($post === null) {
            return false;
        }

        return $this->user()?->can('update', $post) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<int, ValidationRule|string>|string>
     */
    public function rules(): array
    {
        $post = $this->routePost();

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique(Post::class, 'slug')->ignore($post)],
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
        $post = $this->routePost();

        return PostData::from([
            'id' => $post?->id,
            'title' => $this->validated('title'),
            'slug' => $this->validated('slug'),
            'excerpt' => $this->validated('excerpt'),
            'content' => $this->validated('content'),
            'contentFormat' => $this->validated('content_format'),
            'thumbnailId' => $this->validated('thumbnail_id'),
            'authorId' => $post?->author_id,
            'status' => $this->validated('status'),
            'publishedAt' => $this->validated('published_at'),
            'createdAt' => $post?->created_at?->toIso8601String(),
            'updatedAt' => $post?->updated_at?->toIso8601String(),
        ]);
    }

    private function routePost(): ?Post
    {
        $post = $this->route('post');

        return $post instanceof Post ? $post : null;
    }
}
