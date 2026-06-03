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
                    'Khoa CNTT – Trường Đại học Hàng hải Việt Nam thành lập ngày 18/12/1997. Khoa đào tạo chuyên ngành CNTT hệ Đại học chính quy với 3 chuyên ngành: Công nghệ Thông tin, Công nghệ Phần mềm và Truyền thông & Mạng máy tính. Hiện Khoa có 5 Bộ môn với tổng số hơn 1050 sinh viên đang theo học.',
                ]),
                'description_format' => 'blocknote_json',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Ban chủ nhiệm khoa',
                'slug' => 'ban-chu-nhiem-khoa',
                'description' => $this->blockNote([
                    'Ban chủ nhiệm Khoa CNTT đương nhiệm gồm Trưởng khoa và các Phó Trưởng khoa, chịu trách nhiệm quản lý, điều hành hoạt động đào tạo, nghiên cứu và phát triển của Khoa.',
                ]),
                'description_format' => 'blocknote_json',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Bộ môn Khoa học máy tính',
                'slug' => 'bo-mon-khoa-hoc-may-tinh',
                'description' => $this->blockNote([
                    'Phụ trách ngành Công nghệ Thông tin và đảm nhận các học phần cơ sở của Khoa CNTT. Trưởng BM: TS. Nguyễn Hạnh Phúc.',
                ]),
                'description_format' => 'blocknote_json',
                'sort_order' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Bộ môn Hệ thống thông tin',
                'slug' => 'bo-mon-he-thong-thong-tin',
                'description' => $this->blockNote([
                    'Phụ trách ngành Công nghệ Phần mềm. Trưởng BM: TS. Lê Quyết Tiến.',
                ]),
                'description_format' => 'blocknote_json',
                'sort_order' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Bộ môn Truyền thông và mạng máy tính',
                'slug' => 'bo-mon-truyen-thong-va-mang-may-tinh',
                'description' => $this->blockNote([
                    'Phụ trách ngành Truyền thông và Mạng máy tính. Trưởng BM: TS. Hồ Thị Hương Thơm.',
                ]),
                'description_format' => 'blocknote_json',
                'sort_order' => 30,
                'is_active' => true,
            ],
            [
                'name' => 'Bộ môn Kỹ thuật máy tính',
                'slug' => 'bo-mon-ky-thuat-may-tinh',
                'description' => $this->blockNote([
                    'Đảm nhiệm các học phần nền tảng hệ thống cho các ngành. Phó Trưởng BM: ThS. Phạm Trung Minh.',
                ]),
                'description_format' => 'blocknote_json',
                'sort_order' => 40,
                'is_active' => true,
            ],
            [
                'name' => 'Bộ môn Tin học đại cương',
                'slug' => 'bo-mon-tin-hoc-dai-cuong',
                'description' => $this->blockNote([
                    'Đảm nhiệm học phần Tin học Văn phòng và Tin học đại cương cho toàn trường và hỗ trợ các bộ môn chuyên môn. Phó Trưởng BM: ThS. Nguyễn Kim Anh.',
                ]),
                'description_format' => 'blocknote_json',
                'sort_order' => 50,
                'is_active' => true,
            ],
            [
                'name' => 'Ban chấp hành Công đoàn',
                'slug' => 'ban-chap-hanh-cong-doan',
                'description' => $this->blockNote([
                    'Tổ chức Công đoàn Khoa CNTT đại diện và bảo vệ quyền lợi hợp pháp của cán bộ, giảng viên trong Khoa.',
                ]),
                'description_format' => 'blocknote_json',
                'sort_order' => 60,
                'is_active' => true,
            ],
            [
                'name' => 'Liên chi đoàn Khoa CNTT',
                'slug' => 'lien-chi-doan-khoa-cntt',
                'description' => $this->blockNote([
                    'Tổ chức Đoàn Thanh niên cấp Khoa, phụ trách hoạt động phong trào, tình nguyện và hỗ trợ sinh viên.',
                ]),
                'description_format' => 'blocknote_json',
                'sort_order' => 70,
                'is_active' => true,
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
