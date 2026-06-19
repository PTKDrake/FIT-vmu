<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use App\Models\User as AuthenticatedUser;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = $this->user();
        assert($user instanceof AuthenticatedUser);

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($user->id),
            ],
        ];

        $staffProfile = $user->staffProfile;
        if ($staffProfile) {
            $rules = array_merge($rules, [
                'academic_title' => ['nullable', 'string', 'max:50'],
                'full_name' => ['required', 'string', 'max:255'],
                'slug' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('staff_profiles', 'slug')->ignore($staffProfile->id),
                ],
                'staff_email' => ['nullable', 'email', 'max:255'],
                'phone' => ['nullable', 'string', 'max:50'],
                'bio' => ['nullable', 'string'],
                'is_public' => ['required', 'boolean'],
                'avatar_file' => ['nullable', 'image', 'max:2048'],
            ]);
        }

        return $rules;
    }
}
