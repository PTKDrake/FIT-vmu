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
            'name' => 'Thông báo',
            'slug' => 'thong-bao',
            'description' => 'Thông báo hành chính, lịch học và các hướng dẫn cần thiết dành cho sinh viên và giảng viên.',
            'sort_order' => 10,
            'is_active' => true,
        ],
        [
            'name' => 'Tin đơn vị',
            'slug' => 'tin-don-vi',
            'description' => 'Tin tức hoạt động nội bộ của Khoa Công nghệ thông tin và các bộ môn trực thuộc.',
            'sort_order' => 15,
            'is_active' => true,
        ],
        [
            'name' => 'Tuyển sinh',
            'slug' => 'tuyen-sinh',
            'description' => 'Thông tin tuyển sinh, tư vấn và hướng dẫn dành cho thí sinh và phụ huynh.',
            'sort_order' => 20,
            'is_active' => true,
        ],
        [
            'name' => 'Tuyển dụng',
            'slug' => 'tuyen-dung',
            'description' => 'Cơ hội việc làm, thông tin tuyển dụng từ các doanh nghiệp đối tác.',
            'sort_order' => 25,
            'is_active' => true,
        ],
        [
            'name' => 'Kết nối doanh nghiệp',
            'slug' => 'ket-noi-doanh-nghiep',
            'description' => 'Hoạt động hợp tác, kết nối giữa Khoa CNTT và các doanh nghiệp công nghệ.',
            'sort_order' => 30,
            'is_active' => true,
        ],
        [
            'name' => 'Cao học',
            'slug' => 'cao-hoc',
            'description' => 'Thông tin đào tạo sau đại học, tuyển sinh cao học ngành Công nghệ thông tin.',
            'sort_order' => 35,
            'is_active' => true,
        ],
        [
            'name' => 'Thời khóa biểu',
            'slug' => 'thoi-khoa-bieu',
            'description' => 'Lịch học, thời khóa biểu các học phần trong học kỳ.',
            'sort_order' => 40,
            'is_active' => true,
        ],
        [
            'name' => 'Đoàn thanh niên',
            'slug' => 'doan-thanh-nien',
            'description' => 'Hoạt động Đoàn Thanh niên, phong trào sinh viên Khoa CNTT.',
            'sort_order' => 50,
            'is_active' => true,
        ],
        [
            'name' => 'Câu lạc bộ tin học',
            'slug' => 'cau-lac-bo-tin-hoc',
            'description' => 'Hoạt động Câu lạc bộ Tin học, sân chơi công nghệ cho sinh viên.',
            'sort_order' => 55,
            'is_active' => true,
        ],
        [
            'name' => 'Câu lạc bộ nghiên cứu khoa học',
            'slug' => 'cau-lac-bo-nghien-cuu-khoa-hoc',
            'description' => 'Hoạt động nghiên cứu khoa học sinh viên, đề tài và cuộc thi.',
            'sort_order' => 57,
            'is_active' => true,
        ],
        [
            'name' => 'Hoạt động thể thao văn nghệ',
            'slug' => 'hoat-dong-the-thao-van-nghe',
            'description' => 'Hoạt động thể thao, văn nghệ và phong trào của Khoa CNTT.',
            'sort_order' => 60,
            'is_active' => true,
        ],
        [
            'name' => 'Học bổng',
            'slug' => 'hoc-bong',
            'description' => 'Thông tin học bổng khuyến khích học tập, học bổng doanh nghiệp tài trợ.',
            'sort_order' => 65,
            'is_active' => true,
        ],
        [
            'name' => 'Cơ hội việc làm',
            'slug' => 'co-hoi-viec-lam',
            'description' => 'Thông tin việc làm, thực tập và cơ hội nghề nghiệp cho sinh viên.',
            'sort_order' => 70,
            'is_active' => true,
        ],
        [
            'name' => 'Cựu sinh viên',
            'slug' => 'cuu-sinh-vien',
            'description' => 'Kết nối cựu sinh viên, chia sẻ kinh nghiệm và cơ hội hợp tác.',
            'sort_order' => 75,
            'is_active' => true,
        ],
        [
            'name' => 'Hoạt động cộng đồng',
            'slug' => 'hoat-dong-cong-dong',
            'description' => 'Hoạt động tình nguyện, phục vụ cộng đồng của giảng viên và sinh viên.',
            'sort_order' => 80,
            'is_active' => true,
        ],
        [
            'name' => 'NCKH',
            'slug' => 'nghien-cuu-khoa-hoc',
            'description' => 'Thông tin nghiên cứu khoa học của Khoa Công nghệ thông tin.',
            'sort_order' => 85,
            'is_active' => true,
            'children' => [
                [
                    'name' => 'Kiến thức NCKH',
                    'slug' => 'kien-thuc-nckh',
                    'description' => 'Kiến thức và phương pháp nghiên cứu khoa học dành cho giảng viên và sinh viên.',
                    'sort_order' => 86,
                    'is_active' => true,
                ],
                [
                    'name' => 'Các nhà Khoa học',
                    'slug' => 'cac-nha-khoa-hoc',
                    'description' => 'Giới thiệu các nhà khoa học, giảng viên nghiên cứu của Khoa CNTT.',
                    'sort_order' => 87,
                    'is_active' => true,
                ],
                [
                    'name' => 'Công bố Khoa học',
                    'slug' => 'cong-bo-khoa-hoc',
                    'description' => 'Danh mục các công bố khoa học, bài báo và đề tài nghiên cứu.',
                    'sort_order' => 88,
                    'is_active' => true,
                ],
            ],
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
