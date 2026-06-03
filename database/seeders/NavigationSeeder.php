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
use stdClass;

class NavigationSeeder extends Seeder
{
    /**
     * @var list<array{
     *     title: string,
     *     slug: string,
     *     excerpt: string,
     *     seo_title: string,
     *     seo_description: string,
     *     eyebrow: string,
     *     description: string,
     *     primary_action_href: string,
     *     primary_action_label: string,
     *     secondary_action_href: string,
     *     secondary_action_label: string,
     *     rich_text: string
     * }>
     */
    private const PAGES = [
        [
            'title' => 'Giới thiệu VMU',
            'slug' => 'gioi-thieu-vmu',
            'excerpt' => 'Tổng quan về lịch sử, định hướng và thế mạnh của VMU.',
            'seo_title' => 'Giới thiệu VMU',
            'seo_description' => 'Trang giới thiệu tổng quan cho menu điều hướng của VMU.',
            'eyebrow' => 'Tổng quan',
            'description' => 'Khái quát về lịch sử hình thành, định hướng phát triển và những thế mạnh tiêu biểu của Trường Đại học Hàng hải Việt Nam.',
            'primary_action_href' => '#tong-quan',
            'primary_action_label' => 'Xem tổng quan',
            'secondary_action_href' => '/cms/pages',
            'secondary_action_label' => 'Quản lý trang',
            'rich_text' => <<<'HTML'
<h2>VMU trong hành trình phát triển</h2>
<p>VMU là một trong những cơ sở đào tạo trọng điểm về hàng hải, logistics và công nghệ tại khu vực phía Bắc. Nội dung mẫu này được seed để đội biên tập có thể mở trực tiếp trong Puck builder và tiếp tục chỉnh sửa theo đúng component hiện tại.</p>
<p>Từ dữ liệu seed chuẩn, nhóm có thể tái sử dụng trang như một mẫu landing page cho các trang giới thiệu cấp khoa, phòng ban hoặc chương trình đào tạo.</p>
HTML,
        ],
        [
            'title' => 'Sứ mệnh và tầm nhìn',
            'slug' => 'su-menh-va-tam-nhin',
            'excerpt' => 'Các giá trị cốt lõi, sứ mệnh và tầm nhìn phát triển của nhà trường.',
            'seo_title' => 'Sứ mệnh và tầm nhìn',
            'seo_description' => 'Trang định hướng được dùng làm đích cho navigation demo.',
            'eyebrow' => 'Định hướng phát triển',
            'description' => 'Giới thiệu sứ mệnh, tầm nhìn và các giá trị cốt lõi đang dẫn dắt hoạt động đào tạo, nghiên cứu và phục vụ cộng đồng của VMU.',
            'primary_action_href' => '#su-menh',
            'primary_action_label' => 'Đọc sứ mệnh',
            'secondary_action_href' => '#gia-tri-cot-loi',
            'secondary_action_label' => 'Giá trị cốt lõi',
            'rich_text' => <<<'HTML'
<h2>Sứ mệnh</h2>
<p>VMU đào tạo nguồn nhân lực chất lượng cao, thúc đẩy nghiên cứu ứng dụng và phục vụ sự phát triển bền vững của ngành hàng hải, logistics và chuyển đổi số.</p>
<h2>Tầm nhìn</h2>
<p>Nhà trường hướng tới vị thế đại học định hướng ứng dụng hàng đầu, có năng lực kết nối mạnh với doanh nghiệp và hệ sinh thái quốc tế.</p>
HTML,
        ],
        [
            'title' => 'Cơ cấu tổ chức',
            'slug' => 'co-cau-to-chuc',
            'excerpt' => 'Sơ đồ tổ chức, các đơn vị chức năng và đầu mối liên hệ.',
            'seo_title' => 'Cơ cấu tổ chức',
            'seo_description' => 'Trang giới thiệu sơ đồ tổ chức của VMU.',
            'eyebrow' => 'Hệ thống vận hành',
            'description' => 'Tổng hợp nhanh các khối chức năng, đầu mối phối hợp và cơ cấu điều hành để người xem hiểu cách VMU tổ chức hoạt động học thuật và quản trị.',
            'primary_action_href' => '#co-cau',
            'primary_action_label' => 'Xem cơ cấu',
            'secondary_action_href' => '/cms/units',
            'secondary_action_label' => 'Danh sách đơn vị',
            'rich_text' => <<<'HTML'
<h2>Khối học thuật và quản trị</h2>
<p>Các đơn vị học thuật, phòng chức năng và đầu mối hỗ trợ được tổ chức theo hướng rõ vai trò, rõ trách nhiệm và thuận tiện phối hợp liên phòng ban.</p>
<ul>
  <li>Các khoa, bộ môn phụ trách đào tạo và nghiên cứu chuyên sâu.</li>
  <li>Các phòng chức năng bảo đảm vận hành, hỗ trợ sinh viên và công tác đối ngoại.</li>
  <li>Các trung tâm tăng cường hợp tác doanh nghiệp, thực hành và chuyển giao tri thức.</li>
</ul>
HTML,
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
                    'content' => $this->buildPuckJson($pageData),
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

    /**
     * @param  array{
     *     title: string,
     *     slug: string,
     *     eyebrow: string,
     *     description: string,
     *     primary_action_href: string,
     *     primary_action_label: string,
     *     secondary_action_href: string,
     *     secondary_action_label: string,
     *     rich_text: string
     * }  $pageData
     */
    private function buildPuckJson(array $pageData): string
    {
        return json_encode([
            'root' => [
                'props' => [
                    'title' => $pageData['title'],
                ],
            ],
            'content' => $this->assignBlockIds([
                [
                    'type' => 'HeroBanner',
                    'props' => [
                        'id' => "{$pageData['slug']}-hero",
                        'eyebrow' => $pageData['eyebrow'],
                        'title' => $pageData['title'],
                        'description' => $pageData['description'],
                        'primaryActionHref' => $pageData['primary_action_href'],
                        'primaryActionLabel' => $pageData['primary_action_label'],
                        'secondaryActionHref' => $pageData['secondary_action_href'],
                        'secondaryActionLabel' => $pageData['secondary_action_label'],
                    ],
                ],
                [
                    'type' => 'RichText',
                    'props' => [
                        'id' => "{$pageData['slug']}-rich-text",
                        'body' => $pageData['rich_text'],
                    ],
                ],
                [
                    'type' => 'CTASection',
                    'props' => [
                        'id' => "{$pageData['slug']}-cta",
                        'header' => "Khám phá thêm: {$pageData['title']}",
                        'description' => 'Trang mẫu này được tạo bằng seed Puck chuẩn để đội ngũ biên tập có thể tiếp tục chỉnh sửa mà không phát sinh lỗi schema.',
                        'primaryActionLabel' => 'Mở Page Builder',
                        'primaryActionHref' => '/cms/pages',
                        'secondaryActionLabel' => 'Xem navigation',
                        'secondaryActionHref' => '/cms/navigation',
                    ],
                ],
            ], $pageData['slug']),
            'zones' => new stdClass,
        ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    }

    /**
     * @param  list<array<string, mixed>>  $blocks
     * @return list<array<string, mixed>>
     */
    private function assignBlockIds(array $blocks, string $prefix): array
    {
        /** @var list<array<string, mixed>> $blocksWithIds */
        $blocksWithIds = array_map(
            fn (array $block, int $index): array => $this->assignBlockIdsToNode($block, "{$prefix}-".($index + 1)),
            $blocks,
            array_keys($blocks),
        );

        return $blocksWithIds;
    }

    /**
     * @param  array<string, mixed>  $block
     * @return array<string, mixed>
     */
    private function assignBlockIdsToNode(array $block, string $prefix): array
    {
        if (! is_string($block['type'] ?? null)) {
            return [];
        }

        $props = is_array($block['props'] ?? null) ? $block['props'] : [];

        if (! isset($props['id']) || ! is_string($props['id']) || $props['id'] === '') {
            $props['id'] = "{$prefix}-".Str::slug($block['type']);
        }

        $block['id'] = $props['id'];

        foreach ($props as $key => $value) {
            if (! is_array($value) || ! $this->isBlockList($value)) {
                continue;
            }

            $props[$key] = $this->assignBlockIds($value, "{$props['id']}-{$key}");
        }

        $block['props'] = $props;

        return $block;
    }

    /**
     * @param  array<int|string, mixed>  $value
     *
     * @phpstan-assert-if-true list<array<string, mixed>> $value
     */
    private function isBlockList(array $value): bool
    {
        if (! array_is_list($value) || $value === []) {
            return false;
        }

        foreach ($value as $item) {
            if (! is_array($item) || ! is_string($item['type'] ?? null)) {
                return false;
            }
        }

        return true;
    }

    private function resolveModelId(Model $model): int
    {
        /** @var int $id */
        $id = $model->getKey();

        return $id;
    }
}
