<?php

namespace App\Http\Requests;

use App\Models\Media;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\SiteLayout;
use App\Models\StudentGroup;
use App\Support\ContentVisibilityOptions;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Query\Builder as QueryBuilder;
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

    protected function prepareForValidation(): void
    {
        $this->merge([
            'student_group_ids' => $this->normalizeStudentGroupIds($this->all()['student_group_ids'] ?? []),
        ]);
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
        $allowedStatuses = ['draft', 'pending'];

        if ($this->user()?->can('publish posts')) {
            $allowedStatuses[] = 'published';
        }

        return [
            'visibility' => ['required', 'string', Rule::in(ContentVisibilityOptions::visibilities())],
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
            'content_format' => ['required', 'string', Rule::in(['blocknote_json', 'puck_json'])],
            'site_layout_id' => [
                'nullable',
                'integer',
                Rule::exists((new SiteLayout)->getTable(), 'id'),
            ],
            'student_group_ids' => [
                Rule::requiredIf(fn (): bool => $this->string('visibility')->toString() === 'student_groups'),
                'array',
                Rule::when($this->string('visibility')->toString() === 'student_groups', ['min:1']),
            ],
            'student_group_ids.*' => [
                'integer',
                'distinct',
                Rule::exists((new StudentGroup)->getTable(), 'id')->where(
                    fn (QueryBuilder $query): QueryBuilder => $query->where(function (QueryBuilder $visibilityQuery): void {
                        $visibilityQuery
                            ->whereNull('owner_id')
                            ->orWhere('owner_id', $this->user()?->getKey());
                    }),
                ),
            ],
            'thumbnail_id' => [
                'nullable',
                'integer',
                Rule::exists((new Media)->getTable(), 'id'),
            ],
            'status' => [
                'required',
                'string',
                Rule::in($allowedStatuses),
            ],
        ];
    }

    /**
     * @return list<int>
     */
    private function normalizeStudentGroupIds(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        /** @var list<int> $studentGroupIds */
        $studentGroupIds = collect($value)
            ->filter(static fn (mixed $item): bool => is_int($item) || (is_string($item) && is_numeric($item)))
            ->map(static fn (int|string $item): int => (int) $item)
            ->filter(static fn (int $item): bool => $item > 0)
            ->unique()
            ->values()
            ->all();

        return $studentGroupIds;
    }
}
