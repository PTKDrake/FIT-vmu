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
            'name' => 'Tin tức',
            'slug' => 'tin-tuc',
            'description' => 'Tin tức tổng hợp về các hoạt động nổi bật của trường và cộng đồng VMU.',
            'sort_order' => 10,
            'is_active' => true,
            'children' => [
                [
                    'name' => 'Sự kiện',
                    'slug' => 'su-kien',
                    'description' => 'Cập nhật lịch hoạt động, hội thảo và các sự kiện nổi bật.',
                    'sort_order' => 11,
                    'is_active' => true,
                ],
                [
                    'name' => 'Hợp tác quốc tế',
                    'slug' => 'hop-tac-quoc-te',
                    'description' => 'Thông tin hợp tác đối ngoại và các chương trình kết nối quốc tế.',
                    'sort_order' => 12,
                    'is_active' => true,
                ],
            ],
        ],
        [
            'name' => 'Thông báo',
            'slug' => 'thong-bao',
            'description' => 'Thông báo hành chính, lịch học và các hướng dẫn cần biết.',
            'sort_order' => 20,
            'is_active' => true,
        ],
        [
            'name' => 'Tuyển sinh',
            'slug' => 'tuyen-sinh',
            'description' => 'Thông tin tư vấn, phương án tuyển sinh và mốc thời gian quan trọng.',
            'sort_order' => 30,
            'is_active' => true,
        ],
        [
            'name' => 'Đào tạo',
            'slug' => 'dao-tao',
            'description' => 'Nội dung liên quan đến chương trình đào tạo, lịch học và học vụ.',
            'sort_order' => 40,
            'is_active' => true,
        ],
        [
            'name' => 'Nghiên cứu khoa học',
            'slug' => 'nghien-cuu-khoa-hoc',
            'description' => 'Các đề tài, hội nghị và thành tựu nghiên cứu của giảng viên, sinh viên.',
            'sort_order' => 50,
            'is_active' => true,
        ],
        [
            'name' => 'Sinh viên',
            'slug' => 'sinh-vien',
            'description' => 'Hoạt động phong trào, hỗ trợ học tập và thông tin dành cho sinh viên.',
            'sort_order' => 60,
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
                        'parent_id' => $parent->getKey(),
                        'sort_order' => $childCategory['sort_order'],
                        'is_active' => $childCategory['is_active'],
                    ],
                );
            }
        }
    }
}
