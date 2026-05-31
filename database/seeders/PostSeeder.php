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
            'title' => 'VMU khai truong chuoi hoat dong chao don tan sinh vien',
            'slug' => 'vmu-khai-truong-chuoi-hoat-dong-chao-don-tan-sinh-vien',
            'category_slugs' => ['tin-tuc', 'su-kien', 'sinh-vien'],
            'excerpt' => 'Nha truong khoi dong tuan sinh hoat cong dan va cac chuong trinh ket noi cho khoa moi.',
            'paragraphs' => [
                'Tuan le chao don tan sinh vien duoc to chuc voi nhieu hoat dong dinh huong, giao luu va huong dan hoc tap.',
                'Cac khoa va don vi ho tro phoi hop de tan sinh vien nhanh chong lam quen voi moi truong hoc tap moi.',
            ],
            'status' => 'published',
            'published_at' => '2026-05-20 08:00:00',
        ],
        [
            'title' => 'Thong bao dieu chinh lich hoc cac lop buoi toi',
            'slug' => 'thong-bao-dieu-chinh-lich-hoc-cac-lop-buoi-toi',
            'category_slugs' => ['thong-bao', 'dao-tao'],
            'excerpt' => 'Phong Dao tao cap nhat lich hoc buoi toi cho mot so hoc phan trong thang nay.',
            'paragraphs' => [
                'Sinh vien can theo doi thong bao moi tren cong thong tin de cap nhat phong hoc va khung gio hoc chinh xac.',
                'Giang vien phu trach lop se thong bao them ve hinh thuc hoc neu co thay doi.',
            ],
            'status' => 'published',
            'published_at' => '2026-05-24 18:30:00',
        ],
        [
            'title' => 'De an tuyen sinh he dai hoc chinh quy nam 2026',
            'slug' => 'de-an-tuyen-sinh-he-dai-hoc-chinh-quy-nam-2026',
            'category_slugs' => ['tuyen-sinh', 'thong-bao'],
            'excerpt' => 'Thong tin tong quan ve chi tieu, phuong thuc xet tuyen va moc thoi gian quan trong.',
            'paragraphs' => [
                'De an tuyen sinh nam 2026 bo sung cac kenh tu van truc tuyen va chuoi livestream giai dap cho thi sinh.',
                'Thi sinh duoc khuyen nghi chuan bi ho so som va theo doi ky cac moc xac nhan nhap hoc tren he thong.',
            ],
            'status' => 'pending',
            'published_at' => null,
        ],
        [
            'title' => 'Cap nhat hoc lieu mo cho hoc phan Logistics va Quan ly chuoi cung ung',
            'slug' => 'cap-nhat-hoc-lieu-mo-cho-hoc-phan-logistics-va-quan-ly-chuoi-cung-ung',
            'category_slugs' => ['dao-tao', 'thong-bao'],
            'excerpt' => 'Khoa chuyen mon bo sung tai lieu tham khao va bai tap tinh huong tren LMS.',
            'paragraphs' => [
                'Hoc lieu moi duoc chuan hoa theo tung chu de de sinh vien de dang theo doi va tu hoc.',
                'Giang vien co the tai su dung bo tai lieu nay cho cac dot hoc tiep theo de thong nhat noi dung.',
            ],
            'status' => 'draft',
            'published_at' => null,
        ],
        [
            'title' => 'Nhom nghien cuu sinh vien cong bo giai phap mo phong cang thong minh',
            'slug' => 'nhom-nghien-cuu-sinh-vien-cong-bo-giai-phap-mo-phong-cang-thong-minh',
            'category_slugs' => ['nghien-cuu-khoa-hoc', 'tin-tuc', 'sinh-vien'],
            'excerpt' => 'De tai huong den toi uu luong hang va khai thac du lieu thoi gian thuc trong logistics.',
            'paragraphs' => [
                'Mo hinh thu nghiem giup danh gia nang luc khai thac cau ben va muc do un tac theo nhieu kich ban.',
                'Ket qua ban dau cho thay tiem nang mo rong thanh nen tang phuc vu dao tao va nghien cuu ung dung.',
            ],
            'status' => 'published',
            'published_at' => '2026-05-18 09:45:00',
        ],
        [
            'title' => 'Chuoi workshop ky nang hoc tap va nghiep vu danh cho sinh vien nam nhat',
            'slug' => 'chuoi-workshop-ky-nang-hoc-tap-va-nghiep-vu-danh-cho-sinh-vien-nam-nhat',
            'category_slugs' => ['sinh-vien', 'dao-tao', 'su-kien'],
            'excerpt' => 'Trung tam ho tro nguoi hoc mo rong chuoi workshop ve ky nang mem va phuong phap hoc dai hoc.',
            'paragraphs' => [
                'Noi dung workshop tap trung vao ky nang ghi chu, thuyet trinh, hop tac nhom va quan ly thoi gian.',
                'Sinh vien tham gia day du se duoc cong nhan hoat dong ren luyen theo quy dinh cua nha truong.',
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
                'name' => 'Content Seeder',
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
