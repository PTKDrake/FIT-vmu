<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\NavigationMenu;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreNavigationMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', NavigationMenu::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique((new NavigationMenu)->getTable(), 'slug')],
            'location' => ['required', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
