<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\StudentGroup;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreStudentGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        if ($user === null || ! $user->can('create', StudentGroup::class)) {
            return false;
        }

        if ($this->string('scope')->toString() === 'global' && ! $user->can('createGlobal', StudentGroup::class)) {
            return false;
        }

        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'code' => Str::upper(trim($this->string('code')->toString())),
            'student_codes' => $this->normalizeStudentCodes($this->all()['student_codes'] ?? []),
        ]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:64', 'regex:/^[A-Z0-9_-]+$/', Rule::unique((new StudentGroup)->getTable(), 'code')],
            'scope' => ['required', 'string', Rule::in(['global', 'private'])],
            'student_codes' => ['required', 'array', 'min:1'],
            'student_codes.*' => ['string', 'distinct', 'max:64', 'regex:/^[0-9]+$/'],
        ];
    }

    /**
     * @return list<string>
     */
    private function normalizeStudentCodes(mixed $value): array
    {
        if (is_string($value)) {
            $value = preg_split('/[\s,;]+/', $value) ?: [];
        }

        if (! is_array($value)) {
            return [];
        }

        /** @var list<string> $studentCodes */
        $studentCodes = collect($value)
            ->filter(static fn (mixed $item): bool => is_string($item) && trim($item) !== '')
            ->flatMap(static function (string $item): array {
                return preg_split('/[\s,;]+/', trim($item)) ?: [];
            })
            ->filter(static fn (string $item): bool => $item !== '')
            ->unique()
            ->values()
            ->all();

        return $studentCodes;
    }
}
