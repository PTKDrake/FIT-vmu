<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\NavigationMenu;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateNavigationMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        $navigationMenu = $this->route('navigation_menu');

        return $navigationMenu instanceof NavigationMenu
            ? $this->user()?->can('update', $navigationMenu) ?? false
            : false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $navigationMenu = $this->route('navigation_menu');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique((new NavigationMenu)->getTable(), 'slug')->ignore($navigationMenu?->getKey())],
            'location' => ['required', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
