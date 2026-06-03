<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Media;
use App\Models\Page;
use App\Models\StudentGroup;
use App\Rules\ReservedPageSlug;
use App\Support\ContentVisibilityOptions;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        $page = $this->route('page');

        return $page instanceof Page
            ? $this->user()?->can('update', $page) ?? false
            : false;
    }

    protected function prepareForValidation(): void
    {
        $slug = trim($this->string('slug')->toString(), " \t\n\r\0\x0B/");
        $currentSlug = $this->all()['slug'] ?? null;
        $studentGroupIds = $this->normalizeStudentGroupIds($this->all()['student_group_ids'] ?? []);

        $this->merge([
            'slug' => $slug !== '' ? $slug : $currentSlug,
            'student_group_ids' => $studentGroupIds,
        ]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $page = $this->route('page');
        $pageId = $page instanceof Page ? $page->getKey() : null;

        return [
            'visibility' => ['required', 'string', Rule::in(ContentVisibilityOptions::visibilities())],
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique((new Page)->getTable(), 'slug')->ignore($pageId),
                new ReservedPageSlug,
            ],
            'excerpt' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'content_format' => ['required', 'string', Rule::in(['puck_json'])],
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
            'thumbnail_id' => ['nullable', 'integer', Rule::exists((new Media)->getTable(), 'id')],
            'status' => ['required', 'string', Rule::in(['draft', 'pending', 'published', 'rejected'])],
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
