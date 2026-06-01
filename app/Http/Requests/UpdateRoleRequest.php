<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UpdateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        $role = $this->route('role');

        return $role instanceof Role
            ? $this->user()?->can('update', $role) ?? false
            : false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $role = $this->route('role');
        $roleId = $role instanceof Role ? $role->getKey() : null;

        return [
            'name' => ['required', 'string', 'max:255', Rule::unique((new Role)->getTable(), 'name')->ignore($roleId)],
            'permissions' => ['sometimes', 'array'],
            'permissions.*' => ['string', 'distinct', Rule::exists((new Permission)->getTable(), 'name')],
        ];
    }

    /**
     * @return array<int, \Closure(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($this->exists('permissions') && ! ($this->user()?->can('manage permissions') ?? false)) {
                    $validator->errors()->add('permissions', __('auth.not_authorized_manage_permissions'));
                }
            },
        ];
    }
}
