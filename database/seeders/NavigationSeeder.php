<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\NavigationMenu;
use App\Models\PostCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class NavigationSeeder extends Seeder
{
    /**
     * @var array<string, array{
     *     name: string,
     *     slug: string,
     *     location: string,
     *     is_active: bool,
     *     items: list<array{
     *         title: string,
     *         type: 'custom_url'|'post_category',
     *         target: '_self'|'_blank',
     *         sort_order: int,
     *         is_active: bool,
     *         url?: string,
     *         linkable_type?: class-string<Model>,
     *         linkable_slug?: string,
     *         children?: list<array{
     *             title: string,
     *             type: 'custom_url'|'post_category',
     *             target: '_self'|'_blank',
     *             sort_order: int,
     *             is_active: bool,
     *             url?: string,
     *             linkable_type?: class-string<Model>,
     *             linkable_slug?: string
     *         }>
     *     }>
     * }>
     */
    private const MENUS = [
        'header-chinh' => [
            'name' => 'Header chính',
            'slug' => 'header-chinh',
            'location' => 'header',
            'is_active' => true,
            'items' => [
                [
                    'title' => 'Đơn vị',
                    'type' => 'post_category',
                    'linkable_type' => PostCategory::class,
                    'linkable_slug' => 'don-vi',
                    'target' => '_self',
                    'sort_order' => 1,
                    'is_active' => true,
                ],
                [
                    'title' => 'Chuyên ngành',
                    'type' => 'post_category',
                    'linkable_type' => PostCategory::class,
                    'linkable_slug' => 'chuyen-nganh',
                    'target' => '_self',
                    'sort_order' => 2,
                    'is_active' => true,
                ],
                [
                    'title' => 'Tuyển sinh',
                    'type' => 'post_category',
                    'linkable_type' => PostCategory::class,
                    'linkable_slug' => 'tuyen-sinh',
                    'target' => '_self',
                    'sort_order' => 3,
                    'is_active' => true,
                ],
                [
                    'title' => 'Tin tức',
                    'type' => 'post_category',
                    'linkable_type' => PostCategory::class,
                    'linkable_slug' => 'tin-tuc',
                    'target' => '_self',
                    'sort_order' => 4,
                    'is_active' => true,
                    'children' => [
                        [
                            'title' => 'Sự kiện',
                            'type' => 'post_category',
                            'linkable_type' => PostCategory::class,
                            'linkable_slug' => 'su-kien',
                            'target' => '_self',
                            'sort_order' => 1,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Nghiên cứu khoa học',
                            'type' => 'post_category',
                            'linkable_type' => PostCategory::class,
                            'linkable_slug' => 'nghien-cuu-khoa-hoc',
                            'target' => '_self',
                            'sort_order' => 2,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Tin đơn vị',
                            'type' => 'post_category',
                            'linkable_type' => PostCategory::class,
                            'linkable_slug' => 'tin-don-vi',
                            'target' => '_self',
                            'sort_order' => 3,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Hoạt động sinh viên',
                            'type' => 'post_category',
                            'linkable_type' => PostCategory::class,
                            'linkable_slug' => 'hoat-dong-sinh-vien',
                            'target' => '_self',
                            'sort_order' => 4,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Tuyển dụng',
                            'type' => 'post_category',
                            'linkable_type' => PostCategory::class,
                            'linkable_slug' => 'tuyen-dung',
                            'target' => '_self',
                            'sort_order' => 5,
                            'is_active' => true,
                        ],
                    ],
                ],
                [
                    'title' => 'Thông báo',
                    'type' => 'post_category',
                    'linkable_type' => PostCategory::class,
                    'linkable_slug' => 'thong-bao',
                    'target' => '_self',
                    'sort_order' => 5,
                    'is_active' => true,
                ],
            ],
        ],
        'footer-chinh' => [
            'name' => 'Footer chính',
            'slug' => 'footer-chinh',
            'location' => 'footer',
            'is_active' => true,
            'items' => [
                [
                    'title' => 'Sinh viên',
                    'type' => 'custom_url',
                    'url' => '/sinh-vien',
                    'target' => '_self',
                    'sort_order' => 1,
                    'is_active' => true,
                ],
                [
                    'title' => 'Đào tạo',
                    'type' => 'custom_url',
                    'url' => '/dao-tao',
                    'target' => '_self',
                    'sort_order' => 2,
                    'is_active' => true,
                ],
                [
                    'title' => 'Liên hệ',
                    'type' => 'custom_url',
                    'url' => '/content/lien-he',
                    'target' => '_self',
                    'sort_order' => 3,
                    'is_active' => true,
                ],
                [
                    'title' => 'Thông báo',
                    'type' => 'post_category',
                    'linkable_type' => PostCategory::class,
                    'linkable_slug' => 'thong-bao',
                    'target' => '_self',
                    'sort_order' => 4,
                    'is_active' => true,
                ],
            ],
        ],
    ];

    public function run(): void
    {
        foreach (self::MENUS as $menuData) {
            $menu = NavigationMenu::query()->updateOrCreate(
                ['slug' => $menuData['slug']],
                [
                    'name' => $menuData['name'],
                    'slug' => $menuData['slug'],
                    'location' => $menuData['location'],
                    'is_active' => $menuData['is_active'],
                ],
            );

            $menu->items()->delete();
            $this->seedMenuItems($menu, $menuData['items']);
        }
    }

    /**
     * @param  list<array{
     *     title: string,
     *     type: 'custom_url'|'post_category',
     *     target: '_self'|'_blank',
     *     sort_order: int,
     *     is_active: bool,
     *     url?: string,
     *     linkable_type?: class-string<Model>,
     *     linkable_slug?: string,
     *     children?: list<array{
     *         title: string,
     *         type: 'custom_url'|'post_category',
     *         target: '_self'|'_blank',
     *         sort_order: int,
     *         is_active: bool,
     *         url?: string,
     *         linkable_type?: class-string<Model>,
     *         linkable_slug?: string
     *     }>
     * }>  $items
     */
    private function seedMenuItems(NavigationMenu $menu, array $items, ?int $parentId = null): void
    {
        foreach ($items as $itemData) {
            $linkable = $this->resolveLinkable($itemData);

            $item = $menu->items()->create([
                'parent_id' => $parentId,
                'title' => $itemData['title'],
                'type' => $itemData['type'],
                'linkable_type' => $linkable?->getMorphClass(),
                'linkable_id' => $linkable?->getKey(),
                'url' => $itemData['url'] ?? null,
                'target' => $itemData['target'],
                'sort_order' => $itemData['sort_order'],
                'is_active' => $itemData['is_active'],
            ]);

            if (($itemData['children'] ?? []) !== []) {
                $itemKey = $item->getKey();

                if (is_int($itemKey) || (is_string($itemKey) && ctype_digit($itemKey))) {
                    $this->seedMenuItems($menu, $itemData['children'], (int) $itemKey);
                }
            }
        }
    }

    /**
     * @param  array{
     *     type: 'custom_url'|'post_category',
     *     linkable_type?: class-string<Model>,
     *     linkable_slug?: string
     * }  $itemData
     */
    private function resolveLinkable(array $itemData): ?Model
    {
        if ($itemData['type'] === 'custom_url') {
            return null;
        }

        $linkableType = $itemData['linkable_type'] ?? null;
        $linkableSlug = $itemData['linkable_slug'] ?? null;

        if (! is_string($linkableType) || ! is_string($linkableSlug) || $linkableSlug === '') {
            return null;
        }

        /** @var class-string<Model> $linkableType */
        $linkable = $linkableType::query()->where('slug', $linkableSlug)->first();

        return $linkable instanceof Model ? $linkable : null;
    }
}
