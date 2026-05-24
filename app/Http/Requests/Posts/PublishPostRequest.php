<?php

declare(strict_types=1);

namespace App\Http\Requests\Posts;

use App\Data\PostData;
use App\Models\Post;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PublishPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        $post = $this->routePost();

        if ($post === null) {
            return false;
        }

        return $this->user()?->can('publish', $post) ?? false;
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

    public function toDto(): PostData
    {
        $post = $this->routePost();

        return PostData::from([
            'id' => $post?->id,
            'title' => $post?->title,
            'slug' => $post?->slug,
            'excerpt' => $post?->excerpt,
            'content' => $post?->content,
            'contentFormat' => $post?->content_format,
            'thumbnailId' => $post?->thumbnail_id,
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
