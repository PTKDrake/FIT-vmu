<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidationValidator;

class SyncNavigationMenuTreeRequest extends FormRequest
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
        return [
            'items' => ['required', 'array'],
        ];
    }

    /**
     * @return list<array{
     *     id?: int|null,
     *     isActive: bool,
     *     linkableId: ?int,
     *     linkableType: ?string,
     *     target: string,
     *     title: string,
     *     type: string,
     *     url: ?string,
     *     children?: list<mixed>
     * }>
     */
    public function validatedItems(): array
    {
        /** @var list<array{
         *     id?: int|null,
         *     isActive: bool,
         *     linkableId: ?int,
         *     linkableType: ?string,
         *     target: string,
         *     title: string,
         *     type: string,
         *     url: ?string,
         *     children?: list<mixed>
         * }> $items
         */
        $items = $this->array('items');

        return $items;
    }

    public function withValidator(ValidationValidator $validator): void
    {
        $validator->after(function (ValidationValidator $validator): void {
            $this->validateNavigationItems($validator, $this->validatedItems(), '');
        });
    }

    /**
     * @param  list<array<string, mixed>>  $items
     */
    private function validateNavigationItems(ValidationValidator $validator, array $items, string $pathPrefix): void
    {
        foreach ($items as $index => $item) {
            $path = $pathPrefix === '' ? "items.$index" : "$pathPrefix.children.$index";

            $itemValidator = Validator::make($item, [
                'id' => ['nullable', 'integer'],
                'title' => ['required', 'string', 'max:255'],
                'type' => ['required', 'string', Rule::in(['custom_url', 'post_category', 'page', 'post'])],
                'linkableType' => ['nullable', 'string', Rule::in(['post_category', 'page', 'post'])],
                'linkableId' => ['nullable', 'integer'],
                'url' => ['nullable', 'string', 'max:2048'],
                'target' => ['required', 'string', Rule::in(['_self', '_blank'])],
                'isActive' => ['required', 'boolean'],
                'children' => ['sometimes', 'array'],
            ]);

            if ($itemValidator->fails()) {
                foreach ($itemValidator->errors()->messages() as $key => $messages) {
                    foreach ($messages as $message) {
                        $validator->errors()->add("$path.$key", $message);
                    }
                }

                continue;
            }

            $this->validateLinkTarget($validator, $item, $path);

            /** @var list<array<string, mixed>> $children */
            $children = is_array($item['children'] ?? null) ? $item['children'] : [];

            $this->validateNavigationItems($validator, $children, $path);
        }
    }

    /**
     * @param  array<string, mixed>  $item
     */
    private function validateLinkTarget(ValidationValidator $validator, array $item, string $path): void
    {
        $type = is_string($item['type'] ?? null) ? $item['type'] : '';
        $linkableType = is_string($item['linkableType'] ?? null) ? $item['linkableType'] : '';
        $linkableId = is_int($item['linkableId'] ?? null) ? $item['linkableId'] : null;
        $url = is_string($item['url'] ?? null) ? trim($item['url']) : '';

        if ($type === 'custom_url') {
            if ($url === '') {
                $validator->errors()->add("$path.url", 'The url field is required when type is custom_url.');
            } elseif (! $this->isValidNavigationUrl($url)) {
                $validator->errors()->add("$path.url", 'The url field must be a valid relative path or absolute URL.');
            }

            if ($linkableType !== '') {
                $validator->errors()->add("$path.linkableType", 'The linkable type must be empty when type is custom_url.');
            }

            if ($linkableId !== null) {
                $validator->errors()->add("$path.linkableId", 'The linkable id must be empty when type is custom_url.');
            }

            return;
        }

        $expectedLinkableType = $this->expectedLinkableType($type);

        if ($expectedLinkableType === null) {
            return;
        }

        if ($url !== '') {
            $validator->errors()->add("$path.url", 'The url field must be empty unless type is custom_url.');
        }

        if ($linkableType === '') {
            $validator->errors()->add("$path.linkableType", 'The linkable type field is required for the selected item type.');
        } elseif ($linkableType !== $expectedLinkableType) {
            $validator->errors()->add("$path.linkableType", 'The linkable type does not match the selected navigation item type.');
        }

        if ($linkableId === null) {
            $validator->errors()->add("$path.linkableId", 'The linkable id field is required for the selected item type.');
        } elseif ($linkableType === $expectedLinkableType && ! $this->linkableExists($linkableType, $linkableId)) {
            $validator->errors()->add("$path.linkableId", 'The selected link target is invalid.');
        }
    }

    private function expectedLinkableType(string $type): ?string
    {
        return match ($type) {
            'post_category' => 'post_category',
            'page' => 'page',
            'post' => 'post',
            default => null,
        };
    }

    private function linkableExists(string $linkableType, int $linkableId): bool
    {
        $modelClass = match ($linkableType) {
            'post_category' => PostCategory::class,
            'page' => Page::class,
            'post' => Post::class,
            default => null,
        };

        if ($modelClass === null) {
            return false;
        }

        return $modelClass::query()->whereKey($linkableId)->exists();
    }

    private function isValidNavigationUrl(string $url): bool
    {
        if (str_starts_with($url, '/')) {
            return true;
        }

        return filter_var($url, FILTER_VALIDATE_URL) !== false;
    }
}
