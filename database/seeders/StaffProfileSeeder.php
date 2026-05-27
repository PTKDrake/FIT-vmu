<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Position;
use App\Models\StaffProfile;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StaffProfileSeeder extends Seeder
{
    public function run(): void
    {
        // Fetch seeded units
        $unitKcntt = Unit::query()->where('slug', 'khoa-cong-nghe-thong-tin')->first();
        $unitKhmt = Unit::query()->where('slug', 'bo-mon-khoa-hoc-may-tinh')->first();
        $unitHttt = Unit::query()->where('slug', 'bo-mon-he-thong-thong-tin')->first();
        $unitMmt = Unit::query()->where('slug', 'bo-mon-truyen-thong-va-mang-may-tinh')->first();
        $unitVpk = Unit::query()->where('slug', 'van-phong-khoa')->first();

        // Fetch seeded positions
        $posTk = Position::query()->where('slug', 'truong-khoa')->first();
        $posPtk = Position::query()->where('slug', 'pho-truong-khoa')->first();
        $posTbm = Position::query()->where('slug', 'truong-bo-mon')->first();
        $posPtbm = Position::query()->where('slug', 'pho-truong-bo-mon')->first();
        $posGv = Position::query()->where('slug', 'giang-vien')->first();
        $posTldt = Position::query()->where('slug', 'tro-ly-dao-tao')->first();

        if (! $unitKcntt || ! $posTk) {
            return;
        }

        // 1. NGƯỜI DÙNG 1: TRƯỞNG KHOA & GIẢNG VIÊN KHMT
        $user1 = User::query()->updateOrCreate(
            ['email' => 'nguyenvana@vmu.edu.vn'],
            [
                'name' => 'PGS.TS. Nguyễn Văn A',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $user1->assignRole('staff');

        $profile1 = StaffProfile::query()->updateOrCreate(
            ['user_id' => $user1->id],
            [
                'full_name' => $user1->name,
                'slug' => 'pgs-ts-nguyen-van-a',
                'email' => $user1->email,
                'phone' => '0912345678',
                'is_public' => true,
                'bio' => $this->blockNote([
                    'PGS.TS. Nguyễn Văn A là Trưởng khoa Công nghệ thông tin từ năm 2022.',
                    'Ông tốt nghiệp Tiến sĩ ngành Khoa học máy tính tại Pháp năm 2012 và có nhiều công trình nghiên cứu về Trí tuệ nhân tạo và Thị giác máy tính.',
                ]),
            ]
        );

        $profile1->appointments()->updateOrCreate(
            [
                'unit_id' => $unitKcntt->id,
                'position_id' => $posTk->id,
            ],
            [
                'start_date' => '2022-09-01',
                'note' => 'Quyết định bổ nhiệm số 888/QĐ-ĐHHP',
            ]
        );

        if ($unitKhmt && $posGv) {
            $profile1->appointments()->updateOrCreate(
                [
                    'unit_id' => $unitKhmt->id,
                    'position_id' => $posGv->id,
                ],
                [
                    'start_date' => '2012-10-01',
                    'note' => 'Giảng viên cơ hữu bộ môn',
                ]
            );
        }

        // 2. NGƯỜI DÙNG 2: PHÓ TRƯỞNG KHOA & TRƯỞNG BỘ MÔN HTTT
        $user2 = User::query()->updateOrCreate(
            ['email' => 'tranthib@vmu.edu.vn'],
            [
                'name' => 'TS. Trần Thị B',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $user2->assignRole('staff');

        $profile2 = StaffProfile::query()->updateOrCreate(
            ['user_id' => $user2->id],
            [
                'full_name' => $user2->name,
                'slug' => 'ts-tran-thi-b',
                'email' => $user2->email,
                'phone' => '0987654321',
                'is_public' => true,
                'bio' => $this->blockNote([
                    'TS. Trần Thị B hiện là Phó Trưởng khoa phụ trách Đào tạo và kiêm nhiệm Trưởng bộ môn Hệ thống thông tin.',
                    'Lĩnh vực nghiên cứu chính: Cơ sở dữ liệu lớn, Phân tích nghiệp vụ thông minh và Hệ quản trị thông tin doanh nghiệp.',
                ]),
            ]
        );

        $profile2->appointments()->updateOrCreate(
            [
                'unit_id' => $unitKcntt->id,
                'position_id' => $posPtk->id,
            ],
            [
                'start_date' => '2023-03-15',
                'note' => 'Quyết định bổ nhiệm số 222/QĐ-ĐHHP',
            ]
        );

        if ($unitHttt && $posTbm) {
            $profile2->appointments()->updateOrCreate(
                [
                    'unit_id' => $unitHttt->id,
                    'position_id' => $posTbm->id,
                ],
                [
                    'start_date' => '2020-01-01',
                    'note' => 'Quyết định kiêm nhiệm số 111/QĐ-KCNTT',
                ]
            );
        }

        // 3. NGƯỜI DÙNG 3: TRƯỞNG BỘ MÔN MẠNG & TRUYỀN THÔNG
        if ($unitMmt && $posTbm) {
            $user3 = User::query()->updateOrCreate(
                ['email' => 'lehoangc@vmu.edu.vn'],
                [
                    'name' => 'ThS. Lê Hoàng C',
                    'password' => bcrypt('password'),
                    'email_verified_at' => now(),
                ]
            );
            $user3->assignRole('staff');

            $profile3 = StaffProfile::query()->updateOrCreate(
                ['user_id' => $user3->id],
                [
                    'full_name' => $user3->name,
                    'slug' => 'ths-le-hoang-c',
                    'email' => $user3->email,
                    'phone' => '0905678912',
                    'is_public' => true,
                    'bio' => $this->blockNote([
                        'ThS. Lê Hoàng C là Trưởng bộ môn Truyền thông và mạng máy tính.',
                        'Hướng nghiên cứu: An toàn thông tin mạng, Điện toán đám mây và IoT hàng hải.',
                    ]),
                ]
            );

            $profile3->appointments()->updateOrCreate(
                [
                    'unit_id' => $unitMmt->id,
                    'position_id' => $posTbm->id,
                ],
                [
                    'start_date' => '2021-08-01',
                    'note' => 'Quyết định bổ nhiệm số 555/QĐ-ĐHHP',
                ]
            );
        }

        // 4. NGƯỜI DÙNG 4: TRỢ LÝ ĐÀO TẠO VĂN PHÒNG KHOA
        if ($unitVpk && $posTldt) {
            $user4 = User::query()->updateOrCreate(
                ['email' => 'phamthid@vmu.edu.vn'],
                [
                    'name' => 'Bà Phạm Thị D',
                    'password' => bcrypt('password'),
                    'email_verified_at' => now(),
                ]
            );
            $user4->assignRole('staff');

            $profile4 = StaffProfile::query()->updateOrCreate(
                ['user_id' => $user4->id],
                [
                    'full_name' => $user4->name,
                    'slug' => 'ba-pham-thi-d',
                    'email' => $user4->email,
                    'phone' => '0919998887',
                    'is_public' => true,
                    'bio' => $this->blockNote([
                        'Bà Phạm Thị D là Chuyên viên Trợ lý Đào tạo hành chính tại Văn phòng khoa Công nghệ thông tin.',
                        'Hỗ trợ đắc lực công tác quản lý lịch học, giáo vụ và điều phối sinh viên Khoa.',
                    ]),
                ]
            );

            $profile4->appointments()->updateOrCreate(
                [
                    'unit_id' => $unitVpk->id,
                    'position_id' => $posTldt->id,
                ],
                [
                    'start_date' => '2018-05-01',
                    'note' => 'Phân công nhân sự VP Khoa',
                ]
            );
        }
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
