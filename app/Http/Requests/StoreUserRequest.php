<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Validator;
use Spatie\Permission\Models\Role;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', User::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique((new User)->getTable(), 'email')],
            'password' => ['required', Password::defaults(), 'confirmed'],
            'email_verified' => ['required', 'boolean'],
            'roles' => ['nullable', 'array'],
            'roles.*' => ['string', 'distinct', Rule::exists((new Role)->getTable(), 'name')],
        ];
    }

    /**
     * @return array<int, \Closure(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($this->filled('roles') && ! ($this->user()?->can('manage roles') ?? false)) {
                    $validator->errors()->add('roles', __('auth.not_authorized_assign_roles'));
                }
            },
        ];
    }
}
