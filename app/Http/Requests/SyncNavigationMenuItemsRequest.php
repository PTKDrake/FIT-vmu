<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class SyncNavigationMenuItemsRequest extends FormRequest
{
    public function authorize(): bool
    {
        $navigationMenu = $this->route('navigationMenu') ?? $this->route('navigation_menu');

        return $navigationMenu instanceof NavigationMenu
            ? $this->user()?->can('update', $navigationMenu) ?? false
            : false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'distinct'],
            'items.*.parent_id' => ['nullable', 'integer'],
            'items.*.title' => ['required', 'string', 'max:255'],
            'items.*.type' => ['required', 'string', Rule::in(['custom_url', 'post_category', 'page', 'post', 'unit'])],
            'items.*.linkable_type' => ['nullable', 'string', Rule::in(['post_category', 'page', 'post'])],
            'items.*.linkable_id' => ['nullable', 'integer'],
            'items.*.url' => ['nullable', 'string', 'max:2048'],
            'items.*.target' => ['required', 'string', Rule::in(['_self', '_blank'])],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
            'items.*.is_active' => ['required', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $this->validateParentItems($validator);
            $this->validateLinkTargets($validator);
        });
    }

    private function validateParentItems(Validator $validator): void
    {
        /** @var list<array{
         *     id: int,
         *     parent_id: int|null,
         *     title: string,
         *     type: 'custom_url'|'post_category'|'page'|'post'|'unit',
         *     linkable_type: 'post_category'|'page'|'post'|null,
         *     linkable_id: int|null,
         *     url: string|null,
         *     target: '_self'|'_blank',
         *     sort_order: int,
         *     is_active: bool
         * }> $items */
        $items = $this->array('items');
        $itemIds = [];

        foreach ($items as $item) {
            $itemIds[] = $item['id'];
        }
        /** @var array<int, int|null> $parentIdsByItemId */
        $parentIdsByItemId = [];

        foreach ($items as $item) {
            $parentIdsByItemId[$item['id']] = $item['parent_id'];
        }

        foreach ($items as $item) {
            $itemId = (int) $item['id'];

            if ($item['parent_id'] === null) {
                continue;
            }

            if ((int) $item['parent_id'] === $itemId) {
                $validator->errors()->add('items.'.$this->findItemIndex($items, $itemId).'.parent_id', 'The selected parent item is invalid.');

                continue;
            }

            if (! in_array((int) $item['parent_id'], $itemIds, true)) {
                $validator->errors()->add('items.'.$this->findItemIndex($items, $itemId).'.parent_id', 'The selected parent item must exist in the submitted navigation tree.');

                continue;
            }

            $visitedIds = [$itemId => true];
            $nextParentId = (int) $item['parent_id'];

            while ($nextParentId !== null) {
                if (isset($visitedIds[$nextParentId])) {
                    $validator->errors()->add('items.'.$this->findItemIndex($items, $itemId).'.parent_id', 'The selected parent item creates a circular navigation tree.');

                    break;
                }

                $visitedIds[$nextParentId] = true;

                $nextParentId = isset($parentIdsByItemId[$nextParentId]) ? (int) $parentIdsByItemId[$nextParentId] : null;
            }
        }
    }

    private function validateLinkTargets(Validator $validator): void
    {
        /** @var list<array{
         *     id: int,
         *     parent_id: int|null,
         *     title: string,
         *     type: 'custom_url'|'post_category'|'page'|'post'|'unit',
         *     linkable_type: 'post_category'|'page'|'post'|null,
         *     linkable_id: int|null,
         *     url: string|null,
         *     target: '_self'|'_blank',
         *     sort_order: int,
         *     is_active: bool
         * }> $items */
        $items = $this->array('items');

        foreach ($items as $index => $item) {
            $type = $item['type'];
            $linkableType = $item['linkable_type'] ?? null;
            $linkableId = $item['linkable_id'] ?? null;
            $url = trim((string) ($item['url'] ?? ''));

            if ($type === 'custom_url') {
                if ($url === '') {
                    $validator->errors()->add("items.{$index}.url", 'The url field is required when type is custom_url.');
                } elseif (! $this->isValidNavigationUrl($url)) {
                    $validator->errors()->add("items.{$index}.url", 'The url field must be a valid relative path or absolute URL.');
                }

                if ($linkableType !== null) {
                    $validator->errors()->add("items.{$index}.linkable_type", 'The linkable type must be empty when type is custom_url.');
                }

                if ($linkableId !== null) {
                    $validator->errors()->add("items.{$index}.linkable_id", 'The linkable id must be empty when type is custom_url.');
                }

                continue;
            }

            if ($type === 'unit') {
                if ($url !== '') {
                    $validator->errors()->add("items.{$index}.url", 'The url field must be empty when type is unit.');
                }

                if ($linkableType !== null) {
                    $validator->errors()->add("items.{$index}.linkable_type", 'The linkable type must be empty when type is unit.');
                }

                if ($linkableId !== null) {
                    $validator->errors()->add("items.{$index}.linkable_id", 'The linkable id must be empty when type is unit.');
                }

                continue;
            }

            $expectedLinkableType = $this->expectedLinkableType($type);

            if ($expectedLinkableType === null) {
                continue;
            }

            if ($url !== '') {
                $validator->errors()->add("items.{$index}.url", 'The url field must be empty unless type is custom_url.');
            }

            if ($linkableType === null) {
                $validator->errors()->add("items.{$index}.linkable_type", 'The linkable type field is required for the selected item type.');
            } elseif ($linkableType !== $expectedLinkableType) {
                $validator->errors()->add("items.{$index}.linkable_type", 'The linkable type does not match the selected navigation item type.');
            }

            if ($linkableId === null) {
                $validator->errors()->add("items.{$index}.linkable_id", 'The linkable id field is required for the selected item type.');
            } elseif ($linkableType === $expectedLinkableType && ! $this->linkableExists($linkableType, (int) $linkableId)) {
                $validator->errors()->add("items.{$index}.linkable_id", 'The selected link target is invalid.');
            }
        }
    }

    /**
     * @return 'post_category'|'page'|'post'|null
     */
    private function expectedLinkableType(string $type): ?string
    {
        return match ($type) {
            'post_category', 'page', 'post' => $type,
            default => null,
        };
    }

    private function linkableExists(string $linkableType, int $linkableId): bool
    {
        return $this->modelClassForLinkableType($linkableType)::query()->whereKey($linkableId)->exists();
    }

    /**
     * @return class-string<Model>
     */
    private function modelClassForLinkableType(string $linkableType): string
    {
        return match ($linkableType) {
            'post_category' => PostCategory::class,
            'page' => Page::class,
            'post' => Post::class,
            default => throw new \InvalidArgumentException('Unsupported navigation linkable type.'),
        };
    }

    private function isValidNavigationUrl(string $url): bool
    {
        if (str_starts_with($url, '/')) {
            return true;
        }

        return filter_var($url, FILTER_VALIDATE_URL) !== false;
    }

    /**
     * @param  list<array{
     *     id: int,
     *     parent_id: int|null,
     *     title: string
     * }>  $items
     */
    private function findItemIndex(array $items, int $itemId): int
    {
        foreach ($items as $index => $item) {
            if ((int) $item['id'] === $itemId) {
                return $index;
            }
        }

        return 0;
    }
}
