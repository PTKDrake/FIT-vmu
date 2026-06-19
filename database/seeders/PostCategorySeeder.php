<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\PostCategory;
use Illuminate\Database\Seeder;

class PostCategorySeeder extends Seeder
{
    /**
     * @var list<array{
     *     name: string,
     *     slug: string,
     *     description: string,
     *     sort_order: int,
     *     is_active: bool,
     *     children?: list<array{
     *         name: string,
     *         slug: string,
     *         description: string,
     *         sort_order: int,
     *         is_active: bool
     *     }>
     * }>
     */
    private const CATEGORIES = [
        [
            'name' => 'Đơn vị',
            'slug' => 'don-vi',
            'description' => 'Thông tin về các đơn vị, bộ môn và cơ cấu trực thuộc Khoa Công nghệ thông tin.',
            'sort_order' => 1,
            'is_active' => true,
        ],
        [
            'name' => 'Chuyên ngành',
            'slug' => 'chuyen-nganh',
            'description' => 'Thông tin về các chuyên ngành đào tạo của Khoa Công nghệ thông tin.',
            'sort_order' => 2,
            'is_active' => true,
        ],
        [
            'name' => 'Tuyển sinh',
            'slug' => 'tuyen-sinh',
            'description' => 'Thông tin tuyển sinh, tư vấn và hướng dẫn dành cho thí sinh.',
            'sort_order' => 3,
            'is_active' => true,
        ],
        [
            'name' => 'Tin tức',
            'slug' => 'tin-tuc',
            'description' => 'Tổng hợp tin tức, hoạt động và các cập nhật nổi bật của khoa.',
            'sort_order' => 4,
            'is_active' => true,
            'children' => [
                [
                    'name' => 'Sự kiện',
                    'slug' => 'su-kien',
                    'description' => 'Các sự kiện nổi bật, chương trình và hoạt động của khoa.',
                    'sort_order' => 1,
                    'is_active' => true,
                ],
                [
                    'name' => 'Nghiên cứu khoa học',
                    'slug' => 'nghien-cuu-khoa-hoc',
                    'description' => 'Tin tức và hoạt động liên quan đến nghiên cứu khoa học.',
                    'sort_order' => 2,
                    'is_active' => true,
                ],
                [
                    'name' => 'Tin đơn vị',
                    'slug' => 'tin-don-vi',
                    'description' => 'Các cập nhật, thông tin vận hành và hoạt động nội bộ của đơn vị.',
                    'sort_order' => 3,
                    'is_active' => true,
                ],
                [
                    'name' => 'Hoạt động sinh viên',
                    'slug' => 'hoat-dong-sinh-vien',
                    'description' => 'Tin tức về hoạt động học tập, phong trào và đời sống sinh viên.',
                    'sort_order' => 4,
                    'is_active' => true,
                ],
                [
                    'name' => 'Tuyển dụng',
                    'slug' => 'tuyen-dung',
                    'description' => 'Thông tin việc làm, thực tập và cơ hội tuyển dụng dành cho sinh viên.',
                    'sort_order' => 5,
                    'is_active' => true,
                ],
            ],
        ],
        [
            'name' => 'Thông báo',
            'slug' => 'thong-bao',
            'description' => 'Các thông báo chính thức dành cho sinh viên, giảng viên và đối tác.',
            'sort_order' => 5,
            'is_active' => true,
        ],
    ];

    public function run(): void
    {
        foreach (self::CATEGORIES as $category) {
            $parent = PostCategory::query()->updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'name' => $category['name'],
                    'description' => $category['description'],
                    'parent_id' => null,
                    'sort_order' => $category['sort_order'],
                    'is_active' => $category['is_active'],
                ],
            );

            foreach ($category['children'] ?? [] as $childCategory) {
                PostCategory::query()->updateOrCreate(
                    ['slug' => $childCategory['slug']],
                    [
                        'name' => $childCategory['name'],
                        'description' => $childCategory['description'],
                        'parent_id' => $parent->id,
                        'sort_order' => $childCategory['sort_order'],
                        'is_active' => $childCategory['is_active'],
                    ],
                );
            }
        }
    }
}
