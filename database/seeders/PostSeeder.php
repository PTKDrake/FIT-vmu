<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Media;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    /**
     * @var list<array{
     *     title: string,
     *     slug: string,
     *     category_slugs: list<string>,
     *     excerpt: string,
     *     paragraphs: list<string>,
     *     status: 'draft'|'pending'|'published'|'rejected',
     *     published_at: ?string
     * }>
     */
    private const POSTS = [
        [
            'title' => 'VMU khai trương chuỗi hoạt động chào đón tân sinh viên',
            'slug' => 'vmu-khai-truong-chuoi-hoat-dong-chao-don-tan-sinh-vien',
            'category_slugs' => ['thong-bao', 'tin-don-vi', 'doan-thanh-nien'],
            'excerpt' => 'Nhà trường khởi động tuần sinh hoạt công dân và các chương trình kết nối cho khóa mới.',
            'paragraphs' => [
                'Tuần lễ chào đón tân sinh viên được tổ chức với nhiều hoạt động định hướng, giao lưu và hướng dẫn học tập.',
                'Các khoa và đơn vị hỗ trợ phối hợp để tân sinh viên nhanh chóng làm quen với môi trường học tập mới.',
            ],
            'status' => 'published',
            'published_at' => '2026-05-20 08:00:00',
        ],
        [
            'title' => 'Thông báo điều chỉnh lịch học các lớp buổi tối',
            'slug' => 'thong-bao-dieu-chinh-lich-hoc-cac-lop-buoi-toi',
            'category_slugs' => ['thong-bao', 'thoi-khoa-bieu'],
            'excerpt' => 'Phòng Đào tạo cập nhật lịch học buổi tối cho một số học phần trong tháng này.',
            'paragraphs' => [
                'Sinh viên cần theo dõi thông báo mới trên cổng thông tin để cập nhật phòng học và khung giờ học chính xác.',
                'Giảng viên phụ trách lớp sẽ thông báo thêm về hình thức học nếu có thay đổi.',
            ],
            'status' => 'published',
            'published_at' => '2026-05-24 18:30:00',
        ],
        [
            'title' => 'Đề án tuyển sinh hệ đại học chính quy năm 2026',
            'slug' => 'de-an-tuyen-sinh-he-dai-hoc-chinh-quy-nam-2026',
            'category_slugs' => ['tuyen-sinh', 'thong-bao'],
            'excerpt' => 'Thông tin tổng quan về chỉ tiêu, phương thức xét tuyển và mốc thời gian quan trọng.',
            'paragraphs' => [
                'Đề án tuyển sinh năm 2026 bổ sung các kênh tư vấn trực tuyến và chuỗi livestream giải đáp cho thí sinh.',
                'Thí sinh được khuyến nghị chuẩn bị hồ sơ sớm và theo dõi kỹ các mốc xác nhận nhập học trên hệ thống.',
            ],
            'status' => 'pending',
            'published_at' => null,
        ],
        [
            'title' => 'Cập nhật học liệu mở cho học phần Logistics và Quản lý chuỗi cung ứng',
            'slug' => 'cap-nhat-hoc-lieu-mo-cho-hoc-phan-logistics-va-quan-ly-chuoi-cung-ung',
            'category_slugs' => ['thoi-khoa-bieu', 'thong-bao'],
            'excerpt' => 'Khoa chuyên môn bổ sung tài liệu tham khảo và bài tập tình huống trên LMS.',
            'paragraphs' => [
                'Học liệu mới được chuẩn hóa theo từng chủ đề để sinh viên dễ dàng theo dõi và tự học.',
                'Giảng viên có thể tái sử dụng bộ tài liệu này cho các đợt học tiếp theo để thống nhất nội dung.',
            ],
            'status' => 'draft',
            'published_at' => null,
        ],
        [
            'title' => 'Nhóm nghiên cứu sinh viên công bố giải pháp mô phỏng cảng thông minh',
            'slug' => 'nhom-nghien-cuu-sinh-vien-cong-bo-giai-phap-mo-phong-cang-thong-minh',
            'category_slugs' => ['cau-lac-bo-nghien-cuu-khoa-hoc', 'nghien-cuu-khoa-hoc', 'tin-don-vi'],
            'excerpt' => 'Đề tài hướng đến tối ưu luồng hàng và khai thác dữ liệu thời gian thực trong logistics.',
            'paragraphs' => [
                'Mô hình thử nghiệm giúp đánh giá năng lực khai thác cầu bến và mức độ ùn tắc theo nhiều kịch bản.',
                'Kết quả ban đầu cho thấy tiềm năng mở rộng thành nền tảng phục vụ đào tạo và nghiên cứu ứng dụng.',
            ],
            'status' => 'published',
            'published_at' => '2026-05-18 09:45:00',
        ],
        [
            'title' => 'Chuỗi workshop kỹ năng học tập và nghiệp vụ dành cho sinh viên năm nhất',
            'slug' => 'chuoi-workshop-ky-nang-hoc-tap-va-nghiep-vu-danh-cho-sinh-vien-nam-nhat',
            'category_slugs' => ['doan-thanh-nien', 'hoc-bong', 'co-hoi-viec-lam'],
            'excerpt' => 'Trung tâm hỗ trợ người học mở rộng chuỗi workshop về kỹ năng mềm và phương pháp học đại học.',
            'paragraphs' => [
                'Nội dung workshop tập trung vào kỹ năng ghi chú, thuyết trình, hợp tác nhóm và quản lý thời gian.',
                'Sinh viên tham gia đầy đủ sẽ được công nhận hoạt động rèn luyện theo quy định của nhà trường.',
            ],
            'status' => 'rejected',
            'published_at' => null,
        ],
    ];

    public function run(): void
    {
        $author = $this->resolveAuthor();
        $thumbnailIds = Media::query()
            ->orderBy('id')
            ->limit(count(self::POSTS))
            ->pluck('id')
            ->all();

        foreach (self::POSTS as $index => $postData) {
            /** @var Collection<int, PostCategory> $categories */
            $categories = PostCategory::query()
                ->whereIn('slug', $postData['category_slugs'])
                ->orderBy('id')
                ->get();

            $categoryIds = array_values(
                array_map(
                    static fn (int|string $categoryId): int => (int) $categoryId,
                    $categories->modelKeys(),
                ),
            );

            if ($categoryIds === [] || $categories->count() !== count($postData['category_slugs'])) {
                continue;
            }

            Post::query()->updateOrCreate(
                ['slug' => $postData['slug']],
                [
                    'title' => $postData['title'],
                    'excerpt' => $postData['excerpt'],
                    'content' => $this->toBlockNoteJson($postData['paragraphs']),
                    'content_format' => 'blocknote_json',
                    'thumbnail_id' => $thumbnailIds[$index] ?? null,
                    'author_id' => $author->getKey(),
                    'status' => $postData['status'],
                    'published_at' => $postData['published_at'],
                ],
            )->categories()->sync($categoryIds);
        }
    }

    private function resolveAuthor(): User
    {
        $existingAuthor = User::query()
            ->whereIn('email', ['admin@vimaru.edu.vn', 'super-admin@vimaru.edu.vn', 'content-seeder@vimaru.edu.vn'])
            ->first();

        if ($existingAuthor instanceof User) {
            return $existingAuthor;
        }

        /** @var User $author */
        $author = User::query()->updateOrCreate(
            ['email' => 'content-seeder@vimaru.edu.vn'],
            [
                'name' => 'Trình tạo nội dung',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'remember_token' => Str::random(10),
            ],
        );

        if (! $author->hasRole('editor')) {
            $author->assignRole('editor');
        }

        return $author;
    }

    /**
     * @param  list<string>  $paragraphs
     */
    private function toBlockNoteJson(array $paragraphs): string
    {
        return json_encode(
            array_map(
                fn (string $paragraph): array => [
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
                ],
                $paragraphs,
            ),
            JSON_THROW_ON_ERROR,
        );
    }
}
