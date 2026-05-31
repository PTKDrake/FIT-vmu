<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class NavigationSeeder extends Seeder
{
    /**
     * @var list<array{
     *     title: string,
     *     slug: string,
     *     excerpt: string,
     *     seo_title: string,
     *     seo_description: string,
     *     body: string
     * }>
     */
    private const PAGES = [
        [
            'title' => 'Giới thiệu VMU',
            'slug' => 'gioi-thieu-vmu',
            'excerpt' => 'Tổng quan về lịch sử, định hướng và thế mạnh của VMU.',
            'seo_title' => 'Giới thiệu VMU',
            'seo_description' => 'Trang giới thiệu tổng quan cho menu điều hướng của VMU.',
            'body' => 'Thông tin tổng quan về VMU được dùng để minh họa mục điều hướng nội bộ và public.',
        ],
        [
            'title' => 'Sứ mệnh và tầm nhìn',
            'slug' => 'su-menh-va-tam-nhin',
            'excerpt' => 'Các giá trị cốt lõi, sứ mệnh và tầm nhìn phát triển của nhà trường.',
            'seo_title' => 'Sứ mệnh và tầm nhìn',
            'seo_description' => 'Trang định hướng được dùng làm đích cho navigation demo.',
            'body' => 'Trang này mô tả định hướng phát triển dài hạn và giá trị cốt lõi của VMU.',
        ],
        [
            'title' => 'Cơ cấu tổ chức',
            'slug' => 'co-cau-to-chuc',
            'excerpt' => 'Sơ đồ tổ chức, các đơn vị chức năng và đầu mối liên hệ.',
            'seo_title' => 'Cơ cấu tổ chức',
            'seo_description' => 'Trang giới thiệu sơ đồ tổ chức của VMU.',
            'body' => 'Trang này giới thiệu sơ đồ tổ chức và các đơn vị chức năng trong nhà trường.',
        ],
    ];

    /**
     * @var array<string, array{
     *     name: string,
     *     slug: string,
     *     location: string,
     *     is_active: bool,
     *     items: list<array{
     *         title: string,
     *         type: 'custom_url'|'post_category'|'page'|'post',
     *         target: '_self'|'_blank',
     *         sort_order: int,
     *         is_active: bool,
     *         url?: string,
     *         linkable_type?: class-string<Model>,
     *         linkable_slug?: string,
     *         children?: list<array{
     *             title: string,
     *             type: 'custom_url'|'post_category'|'page'|'post',
     *             target: '_self'|'_blank',
     *             sort_order: int,
     *             is_active: bool,
     *             url?: string,
     *             linkable_type?: class-string<Model>,
     *             linkable_slug?: string,
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
                    'title' => 'Trang chủ',
                    'type' => 'custom_url',
                    'url' => '/',
                    'target' => '_self',
                    'sort_order' => 1,
                    'is_active' => true,
                ],
                [
                    'title' => 'Giới thiệu',
                    'type' => 'page',
                    'linkable_type' => Page::class,
                    'linkable_slug' => 'gioi-thieu-vmu',
                    'target' => '_self',
                    'sort_order' => 10,
                    'is_active' => true,
                    'children' => [
                        [
                            'title' => 'Sứ mệnh và tầm nhìn',
                            'type' => 'page',
                            'linkable_type' => Page::class,
                            'linkable_slug' => 'su-menh-va-tam-nhin',
                            'target' => '_self',
                            'sort_order' => 1,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Cơ cấu tổ chức',
                            'type' => 'page',
                            'linkable_type' => Page::class,
                            'linkable_slug' => 'co-cau-to-chuc',
                            'target' => '_self',
                            'sort_order' => 2,
                            'is_active' => true,
                        ],
                    ],
                ],
                [
                    'title' => 'Tin tức',
                    'type' => 'post_category',
                    'linkable_type' => PostCategory::class,
                    'linkable_slug' => 'tin-tuc',
                    'target' => '_self',
                    'sort_order' => 20,
                    'is_active' => true,
                    'children' => [
                        [
                            'title' => 'Thông báo',
                            'type' => 'post_category',
                            'linkable_type' => PostCategory::class,
                            'linkable_slug' => 'thong-bao',
                            'target' => '_self',
                            'sort_order' => 1,
                            'is_active' => true,
                        ],
                    ],
                ],
                [
                    'title' => 'Tuyển sinh',
                    'type' => 'post_category',
                    'linkable_type' => PostCategory::class,
                    'linkable_slug' => 'tuyen-sinh',
                    'target' => '_self',
                    'sort_order' => 30,
                    'is_active' => true,
                ],
                [
                    'title' => 'Liên hệ',
                    'type' => 'custom_url',
                    'url' => '/lien-he',
                    'target' => '_self',
                    'sort_order' => 40,
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
                    'title' => 'Bài viết nổi bật',
                    'type' => 'post',
                    'linkable_type' => Post::class,
                    'linkable_slug' => 'vmu-khai-truong-chuoi-hoat-dong-chao-don-tan-sinh-vien',
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
        $author = $this->resolveAuthor();

        $this->seedPages($author);

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

    private function seedPages(User $author): void
    {
        /** @var int $authorId */
        $authorId = $author->getKey();

        foreach (self::PAGES as $pageData) {
            Page::query()->updateOrCreate(
                ['slug' => $pageData['slug']],
                [
                    'title' => $pageData['title'],
                    'excerpt' => $pageData['excerpt'],
                    'seo_title' => $pageData['seo_title'],
                    'seo_description' => $pageData['seo_description'],
                    'content' => $this->buildPuckJson($pageData['title'], $pageData['body']),
                    'content_format' => 'puck_json',
                    'thumbnail_id' => null,
                    'author_id' => $authorId,
                    'status' => 'published',
                    'published_at' => now(),
                ],
            );
        }
    }

    /**
     * @param  list<array{
     *     title: string,
     *     type: 'custom_url'|'post_category'|'page'|'post',
     *     target: '_self'|'_blank',
     *     sort_order: int,
     *     is_active: bool,
     *     url?: string,
     *     linkable_type?: class-string<Model>,
     *     linkable_slug?: string,
     *     children?: list<array{
     *         title: string,
     *         type: 'custom_url'|'post_category'|'page'|'post',
     *         target: '_self'|'_blank',
     *         sort_order: int,
     *         is_active: bool,
     *         url?: string,
     *         linkable_type?: class-string<Model>,
     *         linkable_slug?: string,
     *     }>
     * }>  $items
     */
    private function seedMenuItems(NavigationMenu $menu, array $items, ?int $parentId = null): void
    {
        foreach ($items as $index => $itemData) {
            /** @var list<array{
             *     title: string,
             *     type: 'custom_url'|'post_category'|'page'|'post',
             *     target: '_self'|'_blank',
             *     sort_order: int,
             *     is_active: bool,
             *     url?: string,
             *     linkable_type?: class-string<Model>,
             *     linkable_slug?: string,
             * }> $children */
            $children = $itemData['children'] ?? [];

            $linkableType = is_string($itemData['linkable_type'] ?? null) ? $itemData['linkable_type'] : null;
            $linkableSlug = is_string($itemData['linkable_slug'] ?? null) ? $itemData['linkable_slug'] : null;

            $item = $menu->items()->create([
                'parent_id' => $parentId,
                'title' => $itemData['title'],
                'type' => $itemData['type'],
                'linkable_type' => $linkableType,
                'linkable_id' => $this->resolveLinkableId($linkableType, $linkableSlug),
                'url' => $itemData['url'] ?? null,
                'target' => $itemData['target'],
                'sort_order' => $itemData['sort_order'],
                'is_active' => $itemData['is_active'],
            ]);

            if ($children !== []) {
                /** @var int $itemId */
                $itemId = $item->getKey();

                $this->seedMenuItems($menu, $children, $itemId);
            }
        }
    }

    /**
     * @param  class-string<Model>|null  $linkableType
     */
    private function resolveLinkableId(?string $linkableType, ?string $linkableSlug): ?int
    {
        if ($linkableType === null || $linkableSlug === null) {
            return null;
        }

        return match ($linkableType) {
            Page::class => $this->resolveModelId(Page::query()->where('slug', $linkableSlug)->firstOrFail()),
            Post::class => $this->resolveModelId(Post::query()->where('slug', $linkableSlug)->firstOrFail()),
            PostCategory::class => $this->resolveModelId(PostCategory::query()->where('slug', $linkableSlug)->firstOrFail()),
            default => throw new \InvalidArgumentException('Unsupported navigation linkable type.'),
        };
    }

    private function resolveAuthor(): User
    {
        $existingAuthor = User::query()
            ->whereIn('email', ['admin@vimaru.edu.vn', 'super-admin@vimaru.edu.vn', 'content-seeder@vimaru.edu.vn'])
            ->first();

        if ($existingAuthor instanceof User) {
            return $existingAuthor;
        }

        /** @var User $author */
        $author = User::query()->updateOrCreate(
            ['email' => 'navigation-seeder@vimaru.edu.vn'],
            [
                'name' => 'Trình tạo navigation',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'remember_token' => Str::random(10),
            ],
        );

        return $author;
    }

    private function buildPuckJson(string $title, string $body): string
    {
        return json_encode([
            'root' => [
                'props' => [
                    'title' => $title,
                ],
                'children' => [],
            ],
            'content' => [
                [
                    'type' => 'paragraph',
                    'props' => [],
                    'content' => [
                        [
                            'type' => 'text',
                            'text' => $body,
                            'styles' => [],
                        ],
                    ],
                    'children' => [],
                ],
            ],
            'zones' => [],
        ], JSON_THROW_ON_ERROR);
    }

    private function resolveModelId(Model $model): int
    {
        /** @var int $id */
        $id = $model->getKey();

        return $id;
    }
}
