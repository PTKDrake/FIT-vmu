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
            'name' => 'Tin tuc',
            'slug' => 'tin-tuc',
            'description' => 'Tin tuc tong hop ve cac hoat dong noi bat cua truong va cong dong VMU.',
            'sort_order' => 10,
            'is_active' => true,
            'children' => [
                [
                    'name' => 'Su kien',
                    'slug' => 'su-kien',
                    'description' => 'Cap nhat lich hoat dong, hoi thao va cac su kien noi bat.',
                    'sort_order' => 11,
                    'is_active' => true,
                ],
                [
                    'name' => 'Hop tac quoc te',
                    'slug' => 'hop-tac-quoc-te',
                    'description' => 'Thong tin hop tac doi ngoai va cac chuong trinh ket noi quoc te.',
                    'sort_order' => 12,
                    'is_active' => true,
                ],
            ],
        ],
        [
            'name' => 'Thong bao',
            'slug' => 'thong-bao',
            'description' => 'Thong bao hanh chinh, lich hoc va cac huong dan can biet.',
            'sort_order' => 20,
            'is_active' => true,
        ],
        [
            'name' => 'Tuyen sinh',
            'slug' => 'tuyen-sinh',
            'description' => 'Thong tin tu van, phuong an tuyen sinh va moc thoi gian quan trong.',
            'sort_order' => 30,
            'is_active' => true,
        ],
        [
            'name' => 'Dao tao',
            'slug' => 'dao-tao',
            'description' => 'Noi dung lien quan den chuong trinh dao tao, lich hoc va hoc vu.',
            'sort_order' => 40,
            'is_active' => true,
        ],
        [
            'name' => 'Nghien cuu khoa hoc',
            'slug' => 'nghien-cuu-khoa-hoc',
            'description' => 'Cac de tai, hoi nghi va thanh tuu nghien cuu cua giang vien, sinh vien.',
            'sort_order' => 50,
            'is_active' => true,
        ],
        [
            'name' => 'Sinh vien',
            'slug' => 'sinh-vien',
            'description' => 'Hoat dong phong trao, ho tro hoc tap va thong tin danh cho sinh vien.',
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
