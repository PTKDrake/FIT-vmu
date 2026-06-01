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

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->route('user');

        return $user instanceof User
            ? $this->user()?->can('update', $user) ?? false
            : false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = $this->route('user');
        $userId = $user instanceof User ? $user->getKey() : null;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique((new User)->getTable(), 'email')->ignore($userId)],
            'password' => ['nullable', Password::defaults(), 'confirmed'],
            'email_verified' => ['required', 'boolean'],
            'roles' => ['sometimes', 'array'],
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
                if ($this->exists('roles') && ! ($this->user()?->can('manage roles') ?? false)) {
                    $validator->errors()->add('roles', __('auth.not_authorized_assign_roles'));
                }
            },
        ];
    }
}
