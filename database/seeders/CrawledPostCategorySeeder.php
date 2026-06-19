<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\PostCategory;
use Illuminate\Database\Seeder;

class CrawledPostCategorySeeder extends Seeder
{
    /**
     * @var list<array{
     *     name: string,
     *     slug: string,
     *     description: string,
     *     sort_order: int,
     *     is_active: bool
     * }>
     */
    private const CATEGORIES = [
        [
            'name' => 'Kết nối doanh nghiệp',
            'slug' => 'ket-noi-doanh-nghiep',
            'description' => 'Tin tức hợp tác doanh nghiệp, hội thảo kết nối và hoạt động định hướng nghề nghiệp.',
            'sort_order' => 6,
            'is_active' => true,
        ],
        [
            'name' => 'Cao học',
            'slug' => 'cao-hoc',
            'description' => 'Thông tin tuyển sinh, đào tạo và hoạt động liên quan đến chương trình cao học.',
            'sort_order' => 7,
            'is_active' => true,
        ],
        [
            'name' => 'Đoàn thanh niên',
            'slug' => 'doan-thanh-nien',
            'description' => 'Hoạt động đoàn thể, phong trào thanh niên và sinh hoạt chi đoàn.',
            'sort_order' => 8,
            'is_active' => true,
        ],
        [
            'name' => 'Câu lạc bộ tin học',
            'slug' => 'cau-lac-bo-tin-hoc',
            'description' => 'Hoạt động của câu lạc bộ tin học và các sân chơi học thuật cho sinh viên.',
            'sort_order' => 9,
            'is_active' => true,
        ],
        [
            'name' => 'Hoạt động thể thao văn nghệ',
            'slug' => 'hoat-dong-the-thao-van-nghe',
            'description' => 'Các hoạt động thể thao, văn nghệ và phong trào đời sống sinh viên.',
            'sort_order' => 10,
            'is_active' => true,
        ],
        [
            'name' => 'Học bổng',
            'slug' => 'hoc-bong',
            'description' => 'Thông tin học bổng, khuyến học và hỗ trợ sinh viên.',
            'sort_order' => 11,
            'is_active' => true,
        ],
        [
            'name' => 'Cơ hội việc làm',
            'slug' => 'co-hoi-viec-lam',
            'description' => 'Cơ hội nghề nghiệp, thực tập và tuyển dụng dành cho sinh viên.',
            'sort_order' => 12,
            'is_active' => true,
        ],
        [
            'name' => 'Cựu sinh viên',
            'slug' => 'cuu-sinh-vien',
            'description' => 'Thông tin kết nối cựu sinh viên và các hoạt động cộng đồng cựu sinh viên.',
            'sort_order' => 13,
            'is_active' => true,
        ],
    ];

    public function run(): void
    {
        foreach (self::CATEGORIES as $category) {
            PostCategory::query()->updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'name' => $category['name'],
                    'description' => $category['description'],
                    'parent_id' => null,
                    'sort_order' => $category['sort_order'],
                    'is_active' => $category['is_active'],
                ],
            );
        }
    }
}
