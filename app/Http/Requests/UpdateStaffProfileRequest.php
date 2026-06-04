<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\StaffProfile;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStaffProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        $staffProfile = $this->route('staffProfile');

        return $staffProfile instanceof StaffProfile
            ? $this->user()?->can('update', $staffProfile) ?? false
            : false;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        $staffProfile = $this->route('staffProfile');
        /** @var int|string|null $staffProfileId */
        $staffProfileId = $staffProfile instanceof StaffProfile ? $staffProfile->getKey() : null;

        return [
            'academic_title' => ['nullable', 'string', 'max:50'],
            'full_name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('staff_profiles', 'slug')->ignore($staffProfileId),
            ],
            'avatar_id' => ['nullable', 'integer', Rule::exists('media', 'id')],
            'avatar_file' => ['nullable', 'image', 'max:2048'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'bio' => ['nullable', 'string'],
            'bio_format' => ['required', 'string', Rule::in(['blocknote_json'])],
            'is_public' => ['required', 'boolean'],
            'appointments' => ['nullable', 'array'],
            'appointments.*.id' => ['nullable', 'integer'],
            'appointments.*.unit_id' => ['required', 'integer', Rule::exists('units', 'id')],
            'appointments.*.position_id' => ['required', 'integer', Rule::exists('positions', 'id')],
            'appointments.*.start_date' => ['required', 'date'],
            'appointments.*.end_date' => ['nullable', 'date', 'after_or_equal:appointments.*.start_date'],
            'appointments.*.note' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
