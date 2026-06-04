<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\NavigationMenu;
use App\Models\Post;
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
     *         type: 'custom_url'|'post_category'|'post',
     *         target: '_self'|'_blank',
     *         sort_order: int,
     *         is_active: bool,
     *         url?: string,
     *         linkable_type?: class-string<Model>,
     *         linkable_slug?: string,
     *         children?: list<array{
     *             title: string,
     *             type: 'custom_url'|'post_category'|'post',
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
                    'title' => 'Đơn vị',
                    'type' => 'post',
                    'linkable_type' => Post::class,
                    'linkable_slug' => 'gioi-thieu-khoa-cong-nghe-thong-tin',
                    'target' => '_self',
                    'sort_order' => 10,
                    'is_active' => true,
                    'children' => [
                        [
                            'title' => 'Ban chủ nhiệm khoa',
                            'type' => 'custom_url',
                            'url' => '/don-vi/ban-chu-nhiem-khoa',
                            'target' => '_self',
                            'sort_order' => 1,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Bộ môn Hệ thống thông tin',
                            'type' => 'custom_url',
                            'url' => '/don-vi/bo-mon-he-thong-thong-tin',
                            'target' => '_self',
                            'sort_order' => 2,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Bộ môn Khoa học máy tính',
                            'type' => 'custom_url',
                            'url' => '/don-vi/bo-mon-khoa-hoc-may-tinh',
                            'target' => '_self',
                            'sort_order' => 3,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Bộ môn Kỹ thuật máy tính',
                            'type' => 'custom_url',
                            'url' => '/don-vi/bo-mon-ky-thuat-may-tinh',
                            'target' => '_self',
                            'sort_order' => 4,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Bộ môn Tin học đại cương',
                            'type' => 'custom_url',
                            'url' => '/don-vi/bo-mon-tin-hoc-dai-cuong',
                            'target' => '_self',
                            'sort_order' => 5,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Bộ môn Truyền thông và Mạng máy tính',
                            'type' => 'custom_url',
                            'url' => '/don-vi/bo-mon-truyen-thong-va-mang-may-tinh',
                            'target' => '_self',
                            'sort_order' => 6,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Ban chấp hành Công đoàn',
                            'type' => 'custom_url',
                            'url' => '/don-vi/ban-chap-hanh-cong-doan',
                            'target' => '_self',
                            'sort_order' => 7,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Liên chi đoàn Khoa CNTT',
                            'type' => 'custom_url',
                            'url' => '/tin/lien-chi-doan-khoa-cong-nghe-thong-tin',
                            'target' => '_self',
                            'sort_order' => 8,
                            'is_active' => true,
                        ],
                    ],
                ],
                [
                    'title' => 'Chuyên ngành',
                    'type' => 'custom_url',
                    'url' => '/chuyen-nganh',
                    'target' => '_self',
                    'sort_order' => 20,
                    'is_active' => true,
                    'children' => [
                        [
                            'title' => 'Công nghệ thông tin',
                            'type' => 'custom_url',
                            'url' => '/chuyen-nganh-cong-nghe-thong-tin',
                            'target' => '_self',
                            'sort_order' => 1,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Công nghệ phần mềm',
                            'type' => 'custom_url',
                            'url' => '/chuyen-nganh/cong-nghe-phan-mem',
                            'target' => '_self',
                            'sort_order' => 2,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Truyền thông và mạng máy tính',
                            'type' => 'custom_url',
                            'url' => '/chuyen-nganh-truyen-thong-va-mang-may-tinh',
                            'target' => '_self',
                            'sort_order' => 3,
                            'is_active' => true,
                        ],
                    ],
                ],
                [
                    'title' => 'NCKH',
                    'type' => 'post_category',
                    'linkable_type' => PostCategory::class,
                    'linkable_slug' => 'nghien-cuu-khoa-hoc',
                    'target' => '_self',
                    'sort_order' => 30,
                    'is_active' => true,
                    'children' => [
                        [
                            'title' => 'Kiến thức NCKH',
                            'type' => 'custom_url',
                            'url' => '/tin/kien-thuc-nckh',
                            'target' => '_self',
                            'sort_order' => 1,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Các nhà Khoa học',
                            'type' => 'custom_url',
                            'url' => '/tin/cac-nha-khoa-hoc',
                            'target' => '_self',
                            'sort_order' => 2,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Công bố Khoa học',
                            'type' => 'custom_url',
                            'url' => '/tin/cong-bo-khoa-hoc',
                            'target' => '_self',
                            'sort_order' => 3,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'NCKH Giảng viên',
                            'type' => 'custom_url',
                            'url' => '/nckh-giang-vien',
                            'target' => '_self',
                            'sort_order' => 4,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'NCKH Sinh viên',
                            'type' => 'custom_url',
                            'url' => '/nckh-sinh-vien',
                            'target' => '_self',
                            'sort_order' => 5,
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
                    'sort_order' => 40,
                    'is_active' => true,
                ],
                [
                    'title' => 'Tuyển dụng',
                    'type' => 'post_category',
                    'linkable_type' => PostCategory::class,
                    'linkable_slug' => 'tuyen-dung',
                    'target' => '_self',
                    'sort_order' => 50,
                    'is_active' => true,
                ],
                [
                    'title' => 'Tài liệu',
                    'type' => 'custom_url',
                    'url' => '/tai-lieu',
                    'target' => '_self',
                    'sort_order' => 60,
                    'is_active' => true,
                    'children' => [
                        [
                            'title' => 'Thư viện',
                            'type' => 'custom_url',
                            'url' => 'http://lib.vimaru.edu.vn/',
                            'target' => '_blank',
                            'sort_order' => 1,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Tài liệu, giáo trình',
                            'type' => 'custom_url',
                            'url' => '/tai-lieu',
                            'target' => '_self',
                            'sort_order' => 2,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Đồ án các khóa',
                            'type' => 'custom_url',
                            'url' => '/nhom-tai-lieu/do-cac-khoa',
                            'target' => '_self',
                            'sort_order' => 3,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Văn bản biểu mẫu',
                            'type' => 'custom_url',
                            'url' => '/nhom-tai-lieu/van-ban-bieu-mau',
                            'target' => '_self',
                            'sort_order' => 4,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Video học tập',
                            'type' => 'custom_url',
                            'url' => '/video-hoc-tap',
                            'target' => '_self',
                            'sort_order' => 5,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Chương trình đào tạo các chuyên ngành',
                            'type' => 'custom_url',
                            'url' => '/nhom-videos/chuong-trinh-dao-tao-cac-chuyen-nganh',
                            'target' => '_self',
                            'sort_order' => 6,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Video Giới thiệu Khoa CNTT',
                            'type' => 'custom_url',
                            'url' => '/nhom-videos/video-gioi-thieu-khoa-cntt',
                            'target' => '_self',
                            'sort_order' => 7,
                            'is_active' => true,
                        ],
                    ],
                ],
                [
                    'title' => 'Cựu SV',
                    'type' => 'post_category',
                    'linkable_type' => PostCategory::class,
                    'linkable_slug' => 'cuu-sinh-vien',
                    'target' => '_self',
                    'sort_order' => 70,
                    'is_active' => true,
                ],
                [
                    'title' => 'Tin tức',
                    'type' => 'post_category',
                    'linkable_type' => PostCategory::class,
                    'linkable_slug' => 'tin-don-vi',
                    'target' => '_self',
                    'sort_order' => 80,
                    'is_active' => true,
                    'children' => [
                        [
                            'title' => 'Cao học',
                            'type' => 'post_category',
                            'linkable_type' => PostCategory::class,
                            'linkable_slug' => 'cao-hoc',
                            'target' => '_self',
                            'sort_order' => 1,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Thông báo',
                            'type' => 'post_category',
                            'linkable_type' => PostCategory::class,
                            'linkable_slug' => 'thong-bao',
                            'target' => '_self',
                            'sort_order' => 2,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Thời khóa biểu',
                            'type' => 'post_category',
                            'linkable_type' => PostCategory::class,
                            'linkable_slug' => 'thoi-khoa-bieu',
                            'target' => '_self',
                            'sort_order' => 3,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Tin đơn vị',
                            'type' => 'post_category',
                            'linkable_type' => PostCategory::class,
                            'linkable_slug' => 'tin-don-vi',
                            'target' => '_self',
                            'sort_order' => 4,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Kết nối doanh nghiệp',
                            'type' => 'post_category',
                            'linkable_type' => PostCategory::class,
                            'linkable_slug' => 'ket-noi-doanh-nghiep',
                            'target' => '_self',
                            'sort_order' => 5,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Đoàn thanh niên',
                            'type' => 'post_category',
                            'linkable_type' => PostCategory::class,
                            'linkable_slug' => 'doan-thanh-nien',
                            'target' => '_self',
                            'sort_order' => 6,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Câu lạc bộ tin học',
                            'type' => 'post_category',
                            'linkable_type' => PostCategory::class,
                            'linkable_slug' => 'cau-lac-bo-tin-hoc',
                            'target' => '_self',
                            'sort_order' => 7,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Câu lạc bộ nghiên cứu khoa học',
                            'type' => 'post_category',
                            'linkable_type' => PostCategory::class,
                            'linkable_slug' => 'cau-lac-bo-nghien-cuu-khoa-hoc',
                            'target' => '_self',
                            'sort_order' => 8,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Hoạt động thể thao văn nghệ',
                            'type' => 'post_category',
                            'linkable_type' => PostCategory::class,
                            'linkable_slug' => 'hoat-dong-the-thao-van-nghe',
                            'target' => '_self',
                            'sort_order' => 9,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Học bổng',
                            'type' => 'post_category',
                            'linkable_type' => PostCategory::class,
                            'linkable_slug' => 'hoc-bong',
                            'target' => '_self',
                            'sort_order' => 10,
                            'is_active' => true,
                        ],
                        [
                            'title' => 'Cơ hội việc làm',
                            'type' => 'post_category',
                            'linkable_type' => PostCategory::class,
                            'linkable_slug' => 'co-hoi-viec-lam',
                            'target' => '_self',
                            'sort_order' => 11,
                            'is_active' => true,
                        ],
                    ],
                ],
                [
                    'title' => 'Liên hệ',
                    'type' => 'custom_url',
                    'url' => '/content/lien-he',
                    'target' => '_self',
                    'sort_order' => 90,
                    'is_active' => true,
                ],
                [
                    'title' => 'Hoạt động cộng đồng',
                    'type' => 'post_category',
                    'linkable_type' => PostCategory::class,
                    'linkable_slug' => 'hoat-dong-cong-dong',
                    'target' => '_self',
                    'sort_order' => 100,
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
     *     type: 'custom_url'|'post_category'|'post',
     *     target: '_self'|'_blank',
     *     sort_order: int,
     *     is_active: bool,
     *     url?: string,
     *     linkable_type?: class-string<Model>,
     *     linkable_slug?: string,
     *     children?: list<array{
     *         title: string,
     *         type: 'custom_url'|'post_category'|'post',
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
        foreach ($items as $itemData) {
            /** @var list<array{
             *     title: string,
             *     type: 'custom_url'|'post_category'|'post',
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
            Post::class => $this->resolveModelId(Post::query()->where('slug', $linkableSlug)->firstOrFail()),
            PostCategory::class => $this->resolveModelId(PostCategory::query()->where('slug', $linkableSlug)->firstOrFail()),
            default => throw new \InvalidArgumentException('Unsupported navigation linkable type.'),
        };
    }

    /**
     * @param  Model  $model
     */
    private function resolveModelId($model): int
    {
        /** @var int $id */
        $id = $model->getKey();

        return $id;
    }
}
