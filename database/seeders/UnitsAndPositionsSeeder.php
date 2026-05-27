<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Position;
use App\Models\Unit;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UnitsAndPositionsSeeder extends Seeder
{
    public function run(): void
    {
        collect($this->units())
            ->each(function (array $unit): void {
                Unit::query()->updateOrCreate(
                    ['slug' => $unit['slug']],
                    [
                        ...$unit,
                    ],
                );
            });

        collect($this->positions())
            ->each(function (array $position): void {
                Position::query()->updateOrCreate(
                    ['slug' => $position['slug']],
                    $position,
                );
            });
    }

    /**
     * @return list<array{
     *     name: string,
     *     slug: string,
     *     description: string,
     *     description_format: string,
     *     sort_order: int,
     *     is_active: bool
     * }>
     */
    private function units(): array
    {
        return [
            [
                'name' => 'Khoa Công nghệ thông tin',
                'slug' => 'khoa-cong-nghe-thong-tin',
                'description' => $this->blockNote([
                    'Đơn vị phụ trách đào tạo, nghiên cứu và chuyển giao trong lĩnh vực công nghệ thông tin của trường.',
                    'Tập trung các mảng khoa học máy tính, hệ thống thông tin, mạng máy tính và công nghệ phần mềm.',
                ]),
                'description_format' => 'blocknote_json',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Bộ môn Khoa học máy tính',
                'slug' => 'bo-mon-khoa-hoc-may-tinh',
                'description' => $this->blockNote([
                    'Phụ trách các học phần nền tảng về thuật toán, cấu trúc dữ liệu và trí tuệ nhân tạo.',
                    'Là đầu mối xây dựng định hướng học thuật cho các nhóm nghiên cứu liên quan đến AI và khoa học dữ liệu.',
                ]),
                'description_format' => 'blocknote_json',
                'sort_order' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Bộ môn Hệ thống thông tin',
                'slug' => 'bo-mon-he-thong-thong-tin',
                'description' => $this->blockNote([
                    'Phụ trách các học phần về phân tích thiết kế hệ thống, dữ liệu doanh nghiệp và chuyển đổi số.',
                    'Đồng hành với các đề tài ứng dụng thực tiễn trong quản trị dữ liệu và hệ thống thông tin phục vụ vận tải biển.',
                ]),
                'description_format' => 'blocknote_json',
                'sort_order' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Bộ môn Truyền thông và mạng máy tính',
                'slug' => 'bo-mon-truyen-thong-va-mang-may-tinh',
                'description' => $this->blockNote([
                    'Phụ trách chương trình về mạng, bảo mật, điện toán đám mây và hạ tầng số.',
                    'Hỗ trợ các học phần thực hành lab và kết nối doanh nghiệp trong các chủ đề network và security.',
                ]),
                'description_format' => 'blocknote_json',
                'sort_order' => 30,
                'is_active' => true,
            ],
            [
                'name' => 'Văn phòng khoa',
                'slug' => 'van-phong-khoa',
                'description' => $this->blockNote([
                    'Đầu mối tiếp nhận hồ sơ, điều phối lịch công tác và hỗ trợ hành chính cho hoạt động của khoa.',
                ]),
                'description_format' => 'blocknote_json',
                'sort_order' => 40,
                'is_active' => true,
            ],
            [
                'name' => 'Trung tâm nghiên cứu ứng dụng hàng hải số',
                'slug' => 'trung-tam-nghien-cuu-ung-dung-hang-hai-so',
                'description' => $this->blockNote([
                    'Kết nối nghiên cứu ứng dụng công nghệ số với bài toán thực tế trong logistics và hàng hải.',
                    'Hiện đang được dùng như dữ liệu demo để kiểm tra public listing và navigation nội bộ.',
                ]),
                'description_format' => 'blocknote_json',
                'sort_order' => 50,
                'is_active' => false,
            ],
        ];
    }

    /**
     * @return list<array{
     *     name: string,
     *     slug: string,
     *     sort_order: int,
     *     is_active: bool
     * }>
     */
    private function positions(): array
    {
        return [
            ['name' => 'Trưởng khoa', 'slug' => 'truong-khoa', 'sort_order' => 1, 'is_active' => true],
            ['name' => 'Phó trưởng khoa', 'slug' => 'pho-truong-khoa', 'sort_order' => 2, 'is_active' => true],
            ['name' => 'Trưởng bộ môn', 'slug' => 'truong-bo-mon', 'sort_order' => 10, 'is_active' => true],
            ['name' => 'Phó trưởng bộ môn', 'slug' => 'pho-truong-bo-mon', 'sort_order' => 20, 'is_active' => true],
            ['name' => 'Giảng viên', 'slug' => 'giang-vien', 'sort_order' => 30, 'is_active' => true],
            ['name' => 'Trợ lý đào tạo', 'slug' => 'tro-ly-dao-tao', 'sort_order' => 40, 'is_active' => true],
            ['name' => 'Chuyên viên truyền thông', 'slug' => 'chuyen-vien-truyen-thong', 'sort_order' => 50, 'is_active' => false],
        ];
    }

    /**
     * @param  list<string>  $paragraphs
     */
    private function blockNote(array $paragraphs): string
    {
        return json_encode(
            collect($paragraphs)
                ->map(fn (string $paragraph): array => [
                    'id' => (string) Str::uuid(),
                    'type' => 'paragraph',
                    'props' => [],
                    'content' => [
                        [
                            'type' => 'text',
                            'text' => $paragraph,
                            'styles' => [],
                        ],
                    ],
                    'children' => [],
                ])
                ->all(),
            JSON_THROW_ON_ERROR,
        );
    }
}
