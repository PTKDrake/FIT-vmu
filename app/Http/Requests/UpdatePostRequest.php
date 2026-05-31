<?php

namespace App\Http\Requests;

use App\Models\Media;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $post = $this->route('post');

        return $post instanceof Post
            ? $this->user()?->can('update', $post) ?? false
            : false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $post = $this->route('post');
        $postId = $post instanceof Post ? $post->getKey() : null;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique((new Post)->getTable(), 'slug')->ignore($postId),
            ],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => [
                'integer',
                'distinct',
                Rule::exists(PostCategory::class, 'id'),
            ],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'content_format' => ['required', 'string', Rule::in(['blocknote_json'])],
            'thumbnail_id' => [
                'nullable',
                'integer',
                Rule::exists((new Media)->getTable(), 'id'),
            ],
            'status' => [
                'required',
                'string',
                Rule::in($this->user()?->can('publish posts') ? ['draft', 'pending', 'published'] : ['draft', 'pending']),
            ],
        ];
    }
}
