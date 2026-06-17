<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Media;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DonViAndChuyenNganhSeeder extends Seeder
{
    private const DATA_PATH = __DIR__.'/data/fit_vimaru_crawled.php';

    /**
     * @var list<array{slug: string, name: string, description: string, sort_order: int}>
     */
    private const UNIT_CHILDREN = [
        ['slug' => 'ban-chu-nhiem-khoa', 'name' => 'Ban chủ nhiệm khoa', 'description' => 'Ban chủ nhiệm Khoa Công nghệ thông tin đương nhiệm và qua các thời kỳ.', 'sort_order' => 1],
        ['slug' => 'bo-mon-he-thong-thong-tin', 'name' => 'Bộ môn Hệ thống thông tin', 'description' => 'Bộ môn Hệ thống thông tin - Khoa Công nghệ thông tin.', 'sort_order' => 2],
        ['slug' => 'bo-mon-khoa-hoc-may-tinh', 'name' => 'Bộ môn Khoa học máy tính', 'description' => 'Bộ môn Khoa học máy tính - Khoa Công nghệ thông tin.', 'sort_order' => 3],
        ['slug' => 'bo-mon-ky-thuat-may-tinh', 'name' => 'Bộ môn Kỹ thuật máy tính', 'description' => 'Bộ môn Kỹ thuật máy tính - Khoa Công nghệ thông tin.', 'sort_order' => 4],
        ['slug' => 'bo-mon-tin-hoc-dai-cuong', 'name' => 'Bộ môn Tin học đại cương', 'description' => 'Bộ môn Tin học đại cương - Khoa Công nghệ thông tin.', 'sort_order' => 5],
        ['slug' => 'bo-mon-truyen-thong-va-mang-may-tinh', 'name' => 'Bộ môn Truyền thông và Mạng máy tính', 'description' => 'Bộ môn Truyền thông và Mạng máy tính - Khoa Công nghệ thông tin.', 'sort_order' => 6],
        ['slug' => 'ban-chap-hanh-cong-doan', 'name' => 'Ban chấp hành Công đoàn', 'description' => 'Ban chấp hành Công đoàn Khoa Công nghệ thông tin.', 'sort_order' => 7],
        ['slug' => 'lien-chi-doan-khoa-cong-nghe-thong-tin', 'name' => 'Liên chi đoàn Khoa CNTT', 'description' => 'Liên chi đoàn Khoa Công nghệ thông tin.', 'sort_order' => 8],
    ];

    /**
     * @var list<array{slug: string, name: string, description: string, sort_order: int}>
     */
    private const MAJOR_CHILDREN = [
        ['slug' => 'cong-nghe-thong-tin', 'name' => 'Chuyên ngành Công nghệ thông tin', 'description' => 'Chuyên ngành Công nghệ thông tin - mã ngành 7480201.', 'sort_order' => 1],
        ['slug' => 'cong-nghe-phan-mem', 'name' => 'Chuyên ngành Công nghệ phần mềm', 'description' => 'Chuyên ngành Công nghệ phần mềm.', 'sort_order' => 2],
        ['slug' => 'truyen-thong-va-mang-may-tinh', 'name' => 'Chuyên ngành Truyền thông và mạng máy tính', 'description' => 'Chuyên ngành Truyền thông và mạng máy tính.', 'sort_order' => 3],
    ];

    public function run(): void
    {
        /** @var array{units: list<array{slug: string, name: string, title: string, html: string}>, majors: list<array{slug: string, name: string, title: string, html: string}>, posts_by_category_slug: array<string, list<array{title: string, slug: string, excerpt: string, html: string, published_at: ?string}>>} $data */
        $data = File::exists(self::DATA_PATH)
            ? (array) require self::DATA_PATH
            : ['units' => [], 'majors' => [], 'posts_by_category_slug' => []];

        $author = $this->resolveAuthor();
        $ids = Media::query()->orderBy('id')->pluck('id')->all();
        $thumbnailIds = [];
        foreach ($ids as $id) {
            $thumbnailIds[] = is_numeric($id) ? (int) $id : 0;
        }

        $donVi = $this->ensureCategory('don-vi', 'Đơn vị', 'Cơ cấu tổ chức, các bộ môn và đơn vị trực thuộc Khoa Công nghệ thông tin.', 2);
        $chuyenNganh = $this->ensureCategory('chuyen-nganh', 'Chuyên ngành', 'Các chuyên ngành đào tạo đại học chính quy của Khoa Công nghệ thông tin.', 3);

        $this->seedUnitChildren($donVi, $data['units'], $author, $thumbnailIds);
        $this->seedMajorChildren($chuyenNganh, $data['majors'], $author, $thumbnailIds);
        $this->seedListingPosts($data['posts_by_category_slug'], $author, $thumbnailIds);
    }

    private function ensureCategory(string $slug, string $name, string $description, int $sortOrder): PostCategory
    {
        /** @var PostCategory $category */
        $category = PostCategory::query()->updateOrCreate(
            ['slug' => $slug],
            [
                'name' => $name,
                'description' => $description,
                'parent_id' => null,
                'sort_order' => $sortOrder,
                'is_active' => true,
            ],
        );

        return $category;
    }

    /**
     * @param  list<array{slug: string, name: string, title: string, html: string}>  $units
     * @param  list<int>  $thumbnailIds
     */
    private function seedUnitChildren(PostCategory $parent, array $units, User $author, array $thumbnailIds): void
    {
        $unitBySlug = $this->indexBySlug($units);
        /** @var int $parentId */
        $parentId = $parent->getKey();

        foreach (self::UNIT_CHILDREN as $index => $child) {
            $category = PostCategory::query()->updateOrCreate(
                ['slug' => $child['slug']],
                [
                    'name' => $child['name'],
                    'description' => $child['description'],
                    'parent_id' => $parentId,
                    'sort_order' => $child['sort_order'],
                    'is_active' => true,
                ],
            );

            $unit = $unitBySlug[$child['slug']] ?? null;
            $title = $unit['title'] ?? $child['name'];
            $html = $unit['html'] ?? '';

            $postSlug = 'don-vi-'.$child['slug'];

            $post = Post::query()->updateOrCreate(
                ['slug' => $postSlug],
                [
                    'title' => $title,
                    'excerpt' => Str::limit($this->toPlainText($html), 220),
                    'content' => $this->toBlockNoteJson($html, $title),
                    'content_format' => 'blocknote_json',
                    'thumbnail_id' => $thumbnailIds[$index % max(1, count($thumbnailIds))] ?? null,
                    'author_id' => $author->getKey(),
                    'status' => 'published',
                    'published_at' => now(),
                ],
            );

            $post->categories()->syncWithoutDetaching([$category->getKey(), $parentId]);
        }
    }

    /**
     * @param  list<array{slug: string, name: string, title: string, html: string}>  $majors
     * @param  list<int>  $thumbnailIds
     */
    private function seedMajorChildren(PostCategory $parent, array $majors, User $author, array $thumbnailIds): void
    {
        $majorBySlug = $this->indexBySlug($majors);
        /** @var int $parentId */
        $parentId = $parent->getKey();

        foreach (self::MAJOR_CHILDREN as $index => $child) {
            $category = PostCategory::query()->updateOrCreate(
                ['slug' => $child['slug']],
                [
                    'name' => $child['name'],
                    'description' => $child['description'],
                    'parent_id' => $parentId,
                    'sort_order' => $child['sort_order'],
                    'is_active' => true,
                ],
            );

            $major = $majorBySlug[$child['slug']] ?? null;
            $title = $major['title'] ?? $child['name'];
            $html = $major['html'] ?? '';

            $postSlug = 'chuyen-nganh-'.$child['slug'];

            $post = Post::query()->updateOrCreate(
                ['slug' => $postSlug],
                [
                    'title' => $title,
                    'excerpt' => Str::limit($this->toPlainText($html), 220),
                    'content' => $this->toBlockNoteJson($html, $title),
                    'content_format' => 'blocknote_json',
                    'thumbnail_id' => $thumbnailIds[($index + 8) % max(1, count($thumbnailIds))] ?? null,
                    'author_id' => $author->getKey(),
                    'status' => 'published',
                    'published_at' => now(),
                ],
            );

            $post->categories()->syncWithoutDetaching([$category->getKey(), $parentId]);
        }
    }

    /**
     * @param  array<string, list<array{title: string, slug: string, excerpt: string, html: string, published_at: ?string}>>  $postsByCategory
     * @param  list<int>  $thumbnailIds
     */
    private function seedListingPosts(array $postsByCategory, User $author, array $thumbnailIds): void
    {
        $offset = 11;

        foreach ($postsByCategory as $categorySlug => $posts) {
            $category = PostCategory::query()->where('slug', $categorySlug)->first();
            if (! $category instanceof PostCategory) {
                continue;
            }

            /** @var int $categoryId */
            $categoryId = $category->getKey();

            foreach ($posts as $index => $postRow) {
                $title = $postRow['title'];
                $slug = $postRow['slug'];
                $html = $postRow['html'];
                $excerpt = $postRow['excerpt'];
                $publishedAt = $postRow['published_at'] ?? null;

                if ($title === '' || $slug === '') {
                    continue;
                }

                $post = Post::query()->updateOrCreate(
                    ['slug' => $slug],
                    [
                        'title' => $title,
                        'excerpt' => $excerpt !== '' ? $excerpt : Str::limit($this->toPlainText($html), 220),
                        'content' => $this->toBlockNoteJson($html, $title),
                        'content_format' => 'blocknote_json',
                        'thumbnail_id' => $thumbnailIds[($offset + $index) % max(1, count($thumbnailIds))] ?? null,
                        'author_id' => $author->getKey(),
                        'status' => 'published',
                        'published_at' => $publishedAt ?? now(),
                    ],
                );

                $post->categories()->syncWithoutDetaching([$categoryId]);
                $offset++;
            }
        }
    }

    /**
     * @param  list<array{slug: string, name: string, title: string, html: string}>  $items
     * @return array<string, array{slug: string, name: string, title: string, html: string}>
     */
    private function indexBySlug(array $items): array
    {
        $result = [];

        foreach ($items as $item) {
            if ($item['slug'] !== '') {
                $result[$item['slug']] = $item;
            }
        }

        return $result;
    }

    private function toPlainText(string $html): string
    {
        $text = strip_tags($html);
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = (string) preg_replace('/\s+/u', ' ', $text);

        return trim($text);
    }

    private function toBlockNoteJson(string $html, string $title): string
    {
        $paragraphs = $this->splitIntoParagraphs($html);

        if ($paragraphs === []) {
            $paragraphs = [$title];
        }

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
            JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE,
        );
    }

    /**
     * @return list<string>
     */
    private function splitIntoParagraphs(string $html): array
    {
        $normalized = (string) preg_replace('/<br\s*\/?>/i', "\n", $html);
        $normalized = (string) preg_replace('/<\/p>\s*<p[^>]*>/i', "\n\n", $normalized);
        $normalized = (string) preg_replace('/<\/(div|li|tr|h[1-6])>\s*/i', "\n", $normalized);
        $normalized = strip_tags($normalized);
        $normalized = html_entity_decode($normalized, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        $chunks = preg_split('/\n{2,}/u', $normalized);
        $result = [];

        if ($chunks === false) {
            return [$normalized];
        }

        foreach ($chunks as $chunk) {
            $clean = trim((string) preg_replace('/\s+/u', ' ', (string) $chunk));
            if ($clean !== '') {
                $result[] = Str::limit($clean, 800);
            }
        }

        return $result;
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
            ['email' => 'donvi-chuyennganh-seeder@vimaru.edu.vn'],
            [
                'name' => 'Trình tạo nội dung Đơn vị & Chuyên ngành',
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
}
