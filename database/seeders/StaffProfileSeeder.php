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
        $unitTtmm = Unit::query()->where('slug', 'bo-mon-truyen-thong-va-mang-may-tinh')->first();
        $unitKtmt = Unit::query()->where('slug', 'bo-mon-ky-thuat-may-tinh')->first();
        $unitThdc = Unit::query()->where('slug', 'bo-mon-tin-hoc-dai-cuong')->first();

        // Fetch seeded positions
        $posTk = Position::query()->where('slug', 'truong-khoa')->first();
        $posPtk = Position::query()->where('slug', 'pho-truong-khoa')->first();
        $posTbm = Position::query()->where('slug', 'truong-bo-mon')->first();
        $posPtbm = Position::query()->where('slug', 'pho-truong-bo-mon')->first();
        $posGv = Position::query()->where('slug', 'giang-vien')->first();

        if (! $unitKcntt || ! $posTk) {
            return;
        }

        // 1. TS. Nguyễn Công Toàn — Trưởng Khoa
        $user1 = User::query()->updateOrCreate(
            ['email' => 'toannc@vimaru.edu.vn'],
            [
                'name' => 'TS. Nguyễn Công Toàn',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $user1->assignRole('staff');

        $profile1 = StaffProfile::query()->updateOrCreate(
            ['user_id' => $user1->id],
            [
                'full_name' => $user1->name,
                'slug' => 'ts-nguyen-cong-toan',
                'email' => $user1->email,
                'phone' => '0225.3735138',
                'is_public' => true,
                'bio' => $this->blockNote([
                    'Trưởng Khoa Công nghệ thông tin đương nhiệm.',
                ]),
            ]
        );

        $profile1->appointments()->updateOrCreate(
            [
                'unit_id' => $unitKcntt->id,
                'position_id' => $posTk->id,
            ],
            [
                'start_date' => now()->toDateString(),
            ]
        );

        // 2. TS. Nguyễn Trung Đức — Phó Trưởng Khoa
        $user2 = User::query()->updateOrCreate(
            ['email' => 'duc.nguyentrung@gmail.com'],
            [
                'name' => 'TS. Nguyễn Trung Đức',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $user2->assignRole('staff');

        $profile2 = StaffProfile::query()->updateOrCreate(
            ['user_id' => $user2->id],
            [
                'full_name' => $user2->name,
                'slug' => 'ts-nguyen-trung-duc',
                'email' => $user2->email,
                'phone' => '0225.3735138',
                'is_public' => true,
                'bio' => $this->blockNote([
                    'Phó Trưởng Khoa phụ trách đào tạo.',
                ]),
            ]
        );

        if ($posPtk) {
            $profile2->appointments()->updateOrCreate(
                [
                    'unit_id' => $unitKcntt->id,
                    'position_id' => $posPtk->id,
                ],
                [
                    'start_date' => now()->toDateString(),
                ]
            );
        }

        // 3. TS. Nguyễn Thị Giang — Phó Trưởng Khoa
        $user3 = User::query()->updateOrCreate(
            ['email' => 'giangnt@vimaru.edu.vn'],
            [
                'name' => 'TS. Nguyễn Thị Giang',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $user3->assignRole('staff');

        $profile3 = StaffProfile::query()->updateOrCreate(
            ['user_id' => $user3->id],
            [
                'full_name' => $user3->name,
                'slug' => 'ts-nguyen-thi-giang',
                'email' => $user3->email,
                'phone' => '0225.3735138',
                'is_public' => true,
                'bio' => $this->blockNote([
                    'Phó Trưởng Khoa.',
                ]),
            ]
        );

        if ($posPtk) {
            $profile3->appointments()->updateOrCreate(
                [
                    'unit_id' => $unitKcntt->id,
                    'position_id' => $posPtk->id,
                ],
                [
                    'start_date' => now()->toDateString(),
                ]
            );
        }

        // 4. TS. Nguyễn Hạnh Phúc — Trưởng BM Khoa học máy tính & Giảng viên Khoa CNTT
        if ($unitKhmt && $posTbm) {
            $user4 = User::query()->updateOrCreate(
                ['email' => 'phucnh@vimaru.edu.vn'],
                [
                    'name' => 'TS. Nguyễn Hạnh Phúc',
                    'password' => bcrypt('password'),
                    'email_verified_at' => now(),
                ]
            );
            $user4->assignRole('staff');

            $profile4 = StaffProfile::query()->updateOrCreate(
                ['user_id' => $user4->id],
                [
                    'full_name' => $user4->name,
                    'slug' => 'ts-nguyen-hanh-phuc',
                    'email' => $user4->email,
                    'phone' => '0225.3735138',
                    'is_public' => true,
                    'bio' => $this->blockNote([
                        'Trưởng Bộ môn Khoa học máy tính.',
                    ]),
                ]
            );

            $profile4->appointments()->updateOrCreate(
                [
                    'unit_id' => $unitKhmt->id,
                    'position_id' => $posTbm->id,
                ],
                [
                    'start_date' => now()->toDateString(),
                ]
            );

            if ($posGv) {
                $profile4->appointments()->updateOrCreate(
                    [
                        'unit_id' => $unitKcntt->id,
                        'position_id' => $posGv->id,
                    ],
                    [
                        'start_date' => now()->toDateString(),
                    ]
                );
            }
        }

        // 5. TS. Lê Quyết Tiến — Trưởng BM Hệ thống thông tin
        if ($unitHttt && $posTbm) {
            $user5 = User::query()->updateOrCreate(
                ['email' => 'tienlq@vimaru.edu.vn'],
                [
                    'name' => 'TS. Lê Quyết Tiến',
                    'password' => bcrypt('password'),
                    'email_verified_at' => now(),
                ]
            );
            $user5->assignRole('staff');

            $profile5 = StaffProfile::query()->updateOrCreate(
                ['user_id' => $user5->id],
                [
                    'full_name' => $user5->name,
                    'slug' => 'ts-le-quyet-tien',
                    'email' => $user5->email,
                    'phone' => '0225.3735138',
                    'is_public' => true,
                    'bio' => $this->blockNote([
                        'Trưởng Bộ môn Hệ thống thông tin.',
                    ]),
                ]
            );

            $profile5->appointments()->updateOrCreate(
                [
                    'unit_id' => $unitHttt->id,
                    'position_id' => $posTbm->id,
                ],
                [
                    'start_date' => now()->toDateString(),
                ]
            );
        }

        // 6. TS. Hồ Thị Hương Thơm — Trưởng BM Truyền thông và Mạng máy tính
        if ($unitTtmm && $posTbm) {
            $user6 = User::query()->updateOrCreate(
                ['email' => 'thomhth@vimaru.edu.vn'],
                [
                    'name' => 'TS. Hồ Thị Hương Thơm',
                    'password' => bcrypt('password'),
                    'email_verified_at' => now(),
                ]
            );
            $user6->assignRole('staff');

            $profile6 = StaffProfile::query()->updateOrCreate(
                ['user_id' => $user6->id],
                [
                    'full_name' => $user6->name,
                    'slug' => 'ts-ho-thi-huong-thom',
                    'email' => $user6->email,
                    'phone' => '0225.3735138',
                    'is_public' => true,
                    'bio' => $this->blockNote([
                        'Trưởng Bộ môn Truyền thông và Mạng máy tính.',
                    ]),
                ]
            );

            $profile6->appointments()->updateOrCreate(
                [
                    'unit_id' => $unitTtmm->id,
                    'position_id' => $posTbm->id,
                ],
                [
                    'start_date' => now()->toDateString(),
                ]
            );
        }

        // 7. ThS. Phạm Trung Minh — Phó Trưởng BM Kỹ thuật máy tính
        if ($unitKtmt && $posPtbm) {
            $user7 = User::query()->updateOrCreate(
                ['email' => 'minhpt@vimaru.edu.vn'],
                [
                    'name' => 'ThS. Phạm Trung Minh',
                    'password' => bcrypt('password'),
                    'email_verified_at' => now(),
                ]
            );
            $user7->assignRole('staff');

            $profile7 = StaffProfile::query()->updateOrCreate(
                ['user_id' => $user7->id],
                [
                    'full_name' => $user7->name,
                    'slug' => 'ths-pham-trung-minh',
                    'email' => $user7->email,
                    'phone' => '0225.3735138',
                    'is_public' => true,
                    'bio' => $this->blockNote([
                        'Phó Trưởng Bộ môn Kỹ thuật máy tính.',
                    ]),
                ]
            );

            $profile7->appointments()->updateOrCreate(
                [
                    'unit_id' => $unitKtmt->id,
                    'position_id' => $posPtbm->id,
                ],
                [
                    'start_date' => now()->toDateString(),
                ]
            );
        }

        // 8. ThS. Nguyễn Kim Anh — Phó Trưởng BM Tin học đại cương
        if ($unitThdc && $posPtbm) {
            $user8 = User::query()->updateOrCreate(
                ['email' => 'anhkimnguyen@vimaru.edu.vn'],
                [
                    'name' => 'ThS. Nguyễn Kim Anh',
                    'password' => bcrypt('password'),
                    'email_verified_at' => now(),
                ]
            );
            $user8->assignRole('staff');

            $profile8 = StaffProfile::query()->updateOrCreate(
                ['user_id' => $user8->id],
                [
                    'full_name' => $user8->name,
                    'slug' => 'ths-nguyen-kim-anh',
                    'email' => $user8->email,
                    'phone' => '0225.3735138',
                    'is_public' => true,
                    'bio' => $this->blockNote([
                        'Phó Trưởng Bộ môn Tin học đại cương.',
                    ]),
                ]
            );

            $profile8->appointments()->updateOrCreate(
                [
                    'unit_id' => $unitThdc->id,
                    'position_id' => $posPtbm->id,
                ],
                [
                    'start_date' => now()->toDateString(),
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
