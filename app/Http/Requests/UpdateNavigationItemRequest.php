<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateNavigationItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        $navigationItem = $this->route('navigation_item');

        return $navigationItem instanceof NavigationItem
            ? $this->user()?->can('update', $navigationItem) ?? false
            : false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'menu_id' => ['required', 'integer', Rule::exists((new NavigationMenu)->getTable(), 'id')],
            'parent_id' => ['nullable', 'integer', Rule::exists((new NavigationItem)->getTable(), 'id')],
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', Rule::in(['custom_url', 'post_category', 'page', 'post', 'none'])],
            'linkable_type' => ['nullable', 'string', Rule::in([PostCategory::class, Page::class, Post::class])],
            'linkable_id' => ['nullable', 'integer'],
            'url' => ['nullable', 'string', 'max:2048'],
            'target' => ['required', 'string', Rule::in(['_self', '_blank'])],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $this->validateParentItem($validator);
            $this->validateLinkTarget($validator);
        });
    }

    private function validateParentItem(Validator $validator): void
    {
        $navigationItem = $this->route('navigation_item');

        if (! $this->filled('parent_id') || ! $this->filled('menu_id')) {
            return;
        }

        $parentId = $this->integer('parent_id');
        $menuId = $this->integer('menu_id');

        $navigationItemKey = $navigationItem instanceof NavigationItem ? $navigationItem->getKey() : null;

        if (is_int($navigationItemKey) && $parentId === $navigationItemKey) {
            $validator->errors()->add('parent_id', 'The selected parent item is invalid.');

            return;
        }

        $parent = NavigationItem::query()->find($parentId);

        if ($parent instanceof NavigationItem && (int) $parent->menu_id !== $menuId) {
            $validator->errors()->add('parent_id', 'The selected parent item must belong to the same menu.');
        }
    }

    private function validateLinkTarget(Validator $validator): void
    {
        $type = $this->string('type')->toString();
        $linkableType = $this->string('linkable_type')->toString();
        $linkableId = $this->filled('linkable_id') ? $this->integer('linkable_id') : null;
        $url = trim($this->string('url')->toString());

        if ($type === 'custom_url') {
            if ($url === '') {
                $validator->errors()->add('url', 'The url field is required when type is custom_url.');
            } elseif (! $this->isValidNavigationUrl($url)) {
                $validator->errors()->add('url', 'The url field must be a valid relative path or absolute URL.');
            }

            if ($linkableType !== '') {
                $validator->errors()->add('linkable_type', 'The linkable type must be empty when type is custom_url.');
            }

            if ($linkableId !== null) {
                $validator->errors()->add('linkable_id', 'The linkable id must be empty when type is custom_url.');
            }

            return;
        }

        if ($type === 'none') {
            if ($url !== '') {
                $validator->errors()->add('url', 'The url field must be empty when type is none.');
            }

            if ($linkableType !== '') {
                $validator->errors()->add('linkable_type', 'The linkable type must be empty when type is none.');
            }

            if ($linkableId !== null) {
                $validator->errors()->add('linkable_id', 'The linkable id must be empty when type is none.');
            }

            return;
        }

        $expectedLinkableType = $this->expectedLinkableType($type);

        if ($expectedLinkableType === null) {
            return;
        }

        if ($url !== '') {
            $validator->errors()->add('url', 'The url field must be empty unless type is custom_url.');
        }

        if ($linkableType === '') {
            $validator->errors()->add('linkable_type', 'The linkable type field is required for the selected item type.');
        } elseif ($linkableType !== $expectedLinkableType) {
            $validator->errors()->add('linkable_type', 'The linkable type does not match the selected navigation item type.');
        }

        if ($linkableId === null) {
            $validator->errors()->add('linkable_id', 'The linkable id field is required for the selected item type.');
        } elseif ($linkableType === $expectedLinkableType && ! $this->linkableExists($linkableType, $linkableId)) {
            $validator->errors()->add('linkable_id', 'The selected link target is invalid.');
        }
    }

    /**
     * @return class-string<Model>|null
     */
    private function expectedLinkableType(string $type): ?string
    {
        return match ($type) {
            'post_category' => PostCategory::class,
            'page' => Page::class,
            'post' => Post::class,
            default => null,
        };
    }

    /** @param class-string<Model> $linkableType */
    private function linkableExists(string $linkableType, int $linkableId): bool
    {
        return $linkableType::query()->whereKey($linkableId)->exists();
    }

    private function isValidNavigationUrl(string $url): bool
    {
        if (str_starts_with($url, '/')) {
            return true;
        }

        return filter_var($url, FILTER_VALIDATE_URL) !== false;
    }
}
