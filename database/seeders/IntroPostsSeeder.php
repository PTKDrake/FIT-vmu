<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use stdClass;

class IntroPostsSeeder extends Seeder
{
    /**
     * @var list<array{
     *     title: string,
     *     slug: string,
     *     excerpt: string,
     *     eyebrow: string,
     *     description: string,
     *     primary_action_href: string,
     *     primary_action_label: string,
     *     secondary_action_href: string,
     *     secondary_action_label: string,
     *     rich_text: string
     * }>
     */
    private const PAGES = [
        [
            'title' => 'Giới thiệu Khoa Công nghệ thông tin',
            'slug' => 'gioi-thieu-khoa-cong-nghe-thong-tin',
            'excerpt' => 'Lịch sử hình thành, cơ cấu tổ chức và thế mạnh đào tạo của Khoa CNTT - Trường Đại học Hàng hải Việt Nam.',
            'eyebrow' => 'Lịch sử & Giới thiệu',
            'description' => 'Khoa Công nghệ thông tin - Trường Đại học Hàng hải Việt Nam thành lập ngày 18/12/1997, tiền thân là Trung tâm CNTT được thành lập từ ngày 17/9/1996.',
            'primary_action_href' => '#lich-su',
            'primary_action_label' => 'Lịch sử thành lập',
            'secondary_action_href' => '#bo-mon',
            'secondary_action_label' => 'Các bộ môn',
            'rich_text' => <<<'HTML'
<h2 id="lich-su">Lịch sử thành lập</h2>
<p>Khoa CNTT – Trường Đại học Hàng hải Việt Nam thành lập ngày 18/12/1997. Tiền thân của Khoa là Trung tâm CNTT được thành lập từ ngày 17/9/1996 với 2 nhiệm vụ cơ bản là đào tạo chuyên ngành CNTT hệ Cao đẳng chính quy và giảng dạy 2 môn Tin học Đại cương và Tin học ứng dụng cho toàn Trường.</p>
<p>Ngay sau khi thành lập, Khoa được giao nhiệm vụ đào tạo chuyên ngành CNTT hệ Đại học chính quy, Đại học không chính quy, Cao đẳng chính quy và giảng dạy 2 môn học Tin học đại cương, Tin học ứng dụng cho các Khoa khác trong toàn Trường.</p>
<p>Vào thời điểm thành lập, cùng với 6 Khoa CNTT khác trong cả nước, Khoa CNTT – Trường Đại học Hàng hải Việt Nam là một trong những khoa CNTT được thành lập sớm. Khóa đại học chính quy đầu tiên của Khoa là lớp CNT39ĐH niên khóa 1998-2002.</p>
<h2>Quá trình phát triển</h2>
<p>Đến năm học 2007-2008, Khoa đã dừng tuyển sinh hệ Cao đẳng chính quy, chỉ tập trung đào tạo hệ Đại học chính quy với quy mô tuyển sinh tăng lên 2-3 lớp/năm. Đến Khóa K54 (2012-2013), Khoa đào tạo theo 3 chuyên ngành hẹp: Công nghệ Thông tin (CNT), Kỹ thuật phần mềm (KPM) và Kỹ thuật truyền thông và mạng máy tính (TTM), quy mô tuyển sinh 200 sinh viên/năm.</p>
<p>Từ năm học 2016-2017, Khoa xây dựng và đưa vào tuyển sinh hệ Đại học chính quy chất lượng cao ngành CNTT. Từ năm 2013, với 11 Tiến sĩ, Khoa đưa vào đào tạo hệ Thạc sỹ ngành CNTT. Đến năm học 2017-2018, thời gian đào tạo của tất cả chuyên ngành được rút ngắn còn 4 năm theo chuẩn CDIO.</p>
<h2 id="bo-mon">Cơ cấu 5 Bộ môn hiện nay</h2>
<ul>
  <li><strong>Bộ môn Khoa học máy tính</strong> - TS. Nguyễn Hạnh Phúc (Trưởng BM), phụ trách ngành CNT và các học phần cơ sở của Khoa.</li>
  <li><strong>Bộ môn Hệ thống thông tin</strong> - TS. Lê Quyết Tiến (Trưởng BM), phụ trách ngành KPM.</li>
  <li><strong>Bộ môn Truyền thông và mạng máy tính</strong> - TS. Hồ Thị Hương Thơm (Trưởng BM), phụ trách ngành TTM.</li>
  <li><strong>Bộ môn Kỹ thuật máy tính</strong> - ThS. Phạm Trung Minh (Phó Trưởng BM), đảm nhiệm các học phần nền tảng hệ thống.</li>
  <li><strong>Bộ môn Tin học đại cương</strong> - ThS. Nguyễn Kim Anh (Phó Trưởng BM), đảm nhiệm Tin học Văn phòng và Tin học đại cương cho toàn trường.</li>
</ul>
<h2>Quy mô đào tạo &amp; Cơ sở vật chất</h2>
<p>Tổng số sinh viên theo học tại Khoa CNTT hiện nay là <strong>1.050 sinh viên</strong>. Hằng năm chỉ tiêu tuyển sinh là 250-300 sinh viên cho 3 chuyên ngành Đại học chính quy và 40 Thạc sỹ cho 2 đợt tuyển sinh.</p>
<p>Khoa đang quản lý hơn 400 máy tính cùng các thiết bị thực hành, thí nghiệm chuyên ngành về Công nghệ phần mềm, Quản trị hệ thống mạng và nhiều lĩnh vực khác.</p>
HTML,
        ],
        [
            'title' => 'Sứ mệnh và tầm nhìn',
            'slug' => 'su-menh-va-tam-nhin',
            'excerpt' => 'Sứ mạng, tầm nhìn đến năm 2030 và giá trị văn hóa "Trí tuệ - Sáng tạo - Trách nhiệm - Nhân văn" của Nhà trường.',
            'eyebrow' => 'Định hướng phát triển',
            'description' => 'Trường đại học đa ngành nghề có uy tín trong khu vực và thế giới; đào tạo nguồn nhân lực cho ngành kinh tế biển và xã hội, phục vụ công cuộc xây dựng đất nước và hội nhập quốc tế.',
            'primary_action_href' => '#tam-nhin',
            'primary_action_label' => 'Xem tầm nhìn',
            'secondary_action_href' => '#gia-tri',
            'secondary_action_label' => 'Giá trị văn hóa',
            'rich_text' => <<<'HTML'
<h2>Sứ mạng</h2>
<p>Trường Đại học Hàng hải Việt Nam là trường đại học đa ngành nghề có uy tín trong khu vực và thế giới; đào tạo nguồn nhân lực cho ngành kinh tế biển và xã hội, phục vụ công cuộc xây dựng đất nước và hội nhập quốc tế.</p>
<h2 id="tam-nhin">Tầm nhìn</h2>
<ul>
  <li><strong>Đến năm 2020:</strong> Hoàn thành giai đoạn thứ nhất về xây dựng cơ sở hạ tầng phục vụ chiến lược Trường trọng điểm quốc gia. Đội ngũ giảng viên đạt chuẩn về chuyên môn, ngoại ngữ; một số ngành đào tạo được công nhận chất lượng theo tiêu chuẩn AUN; đạt thành tựu bước đầu trong hợp tác song phương về nghiên cứu khoa học, chuyển giao công nghệ và trao đổi giảng viên, sinh viên.</li>
  <li><strong>Đến năm 2025:</strong> Đạt trình độ ngang bằng với các trường Đại học Hàng hải của các nước phát triển trong khối ASEAN (Thái Lan, Malaysia,...).</li>
  <li><strong>Đến năm 2030:</strong> Đạt trình độ ngang bằng với các trường trong khối Đại học Hàng hải khu vực Châu Á - Thái Bình Dương (Hàn Quốc, Trung Quốc, Nga,...); đủ khả năng đào tạo nguồn nhân lực trình độ cao cho chiến lược phát triển kinh tế biển, nghiên cứu và thực nghiệm các công nghệ mới phục vụ nhu cầu dân dụng và quân sự; thu hút học viên từ các nước trong khu vực và thế giới.</li>
</ul>
<h2 id="gia-tri">Giá trị văn hóa</h2>
<p><em>"Trí tuệ - Sáng tạo - Trách nhiệm - Nhân văn"</em></p>
HTML,
        ],
        [
            'title' => 'Cơ cấu tổ chức',
            'slug' => 'co-cau-to-chuc',
            'excerpt' => 'Ban chủ nhiệm khoa đương nhiệm và các đơn vị thuộc Khoa Công nghệ thông tin.',
            'eyebrow' => 'Hệ thống vận hành',
            'description' => 'Cơ cấu tổ chức và Ban chủ nhiệm Khoa CNTT đương nhiệm cùng các đơn vị chuyên môn, đoàn thể trực thuộc.',
            'primary_action_href' => '#ban-chu-nhiem',
            'primary_action_label' => 'Ban chủ nhiệm',
            'secondary_action_href' => '#don-vi',
            'secondary_action_label' => 'Các đơn vị',
            'rich_text' => <<<'HTML'
<h2 id="ban-chu-nhiem">Ban chủ nhiệm Khoa đương nhiệm</h2>
<ul>
  <li><strong>TS. Nguyễn Công Toàn</strong> — Trưởng Khoa</li>
  <li><strong>TS. Nguyễn Trung Đức</strong> — Phó Trưởng Khoa</li>
  <li><strong>TS. Nguyễn Thị Giang</strong> — Phó Trưởng Khoa</li>
</ul>
<h2 id="don-vi">Các đơn vị trực thuộc</h2>
<ul>
  <li>Ban chủ nhiệm khoa</li>
  <li>Bộ môn Khoa học máy tính</li>
  <li>Bộ môn Hệ thống thông tin</li>
  <li>Bộ môn Truyền thông và mạng máy tính</li>
  <li>Bộ môn Kỹ thuật máy tính</li>
  <li>Bộ môn Tin học đại cương</li>
  <li>Ban chấp hành Công đoàn</li>
  <li>Liên chi đoàn Khoa CNTT</li>
</ul>
<h2>Ban chủ nhiệm qua các thời kỳ</h2>
<ul>
  <li>TS. Lê Đức Mẫn – Giám đốc Trung tâm CNTT (đơn vị tiền thân)</li>
  <li>PGS. TSKH. Thân Ngọc Hoàn – Chủ nhiệm Khoa đầu tiên</li>
  <li>NGƯT. TS. Lê Quốc Định – Trưởng Khoa gắn bó lâu nhất</li>
  <li>TS. Phùng Văn Ổn – Nguyên Phó Trưởng Khoa</li>
  <li>TS. Nguyễn Cảnh Toàn – Nguyên Phó Trưởng Khoa</li>
  <li>PGS. TSKH. Đỗ Đức Lưu – Nguyên Phó Trưởng Khoa</li>
  <li>TS. Nguyễn Trọng Đức – Nguyên Phó Trưởng Khoa</li>
  <li>TS. Nguyễn Hữu Tuân – Nguyên Trưởng Khoa</li>
</ul>
HTML,
        ],
    ];

    public function run(): void
    {
        $author = $this->resolveAuthor();

        $category = PostCategory::query()->updateOrCreate(
            ['slug' => 'gioi-thieu'],
            [
                'name' => 'Giới thiệu',
                'sort_order' => 5,
                'is_active' => true,
            ],
        );

        /** @var int $categoryId */
        $categoryId = $category->getKey();

        /** @var int $authorId */
        $authorId = $author->getKey();

        foreach (self::PAGES as $pageData) {
            $post = Post::query()->updateOrCreate(
                ['slug' => $pageData['slug']],
                [
                    'title' => $pageData['title'],
                    'excerpt' => $pageData['excerpt'],
                    'content' => $this->buildPuckJson($pageData),
                    'content_format' => 'puck_json',
                    'visibility' => 'public',
                    'author_id' => $authorId,
                    'status' => 'published',
                    'published_at' => now(),
                ],
            );

            $post->categories()->syncWithoutDetaching([$categoryId]);
        }
    }

    /**
     * @param  array{
     *     title: string,
     *     slug: string,
     *     eyebrow: string,
     *     description: string,
     *     primary_action_href: string,
     *     primary_action_label: string,
     *     secondary_action_href: string,
     *     secondary_action_label: string,
     *     rich_text: string
     * }  $pageData
     */
    private function buildPuckJson(array $pageData): string
    {
        return json_encode([
            'root' => [
                'props' => [
                    'title' => $pageData['title'],
                ],
            ],
            'content' => $this->assignBlockIds([
                [
                    'type' => 'HeroBanner',
                    'props' => [
                        'id' => "{$pageData['slug']}-hero",
                        'eyebrow' => $pageData['eyebrow'],
                        'title' => $pageData['title'],
                        'description' => $pageData['description'],
                        'primaryActionHref' => $pageData['primary_action_href'],
                        'primaryActionLabel' => $pageData['primary_action_label'],
                        'secondaryActionHref' => $pageData['secondary_action_href'],
                        'secondaryActionLabel' => $pageData['secondary_action_label'],
                    ],
                ],
                [
                    'type' => 'RichText',
                    'props' => [
                        'id' => "{$pageData['slug']}-rich-text",
                        'body' => $pageData['rich_text'],
                    ],
                ],
                [
                    'type' => 'CTASection',
                    'props' => [
                        'id' => "{$pageData['slug']}-cta",
                        'header' => "Khám phá thêm: {$pageData['title']}",
                        'description' => 'Trang được seed từ dữ liệu thực tế của fit.vimaru.edu.vn để đội biên tập tiếp tục chỉnh sửa trong Puck builder.',
                        'primaryActionLabel' => 'Mở Page Builder',
                        'primaryActionHref' => '/cms/pages',
                        'secondaryActionLabel' => 'Xem navigation',
                        'secondaryActionHref' => '/cms/navigation',
                    ],
                ],
            ], $pageData['slug']),
            'zones' => new stdClass,
        ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    }

    /**
     * @param  list<array<string, mixed>>  $blocks
     * @return list<array<string, mixed>>
     */
    private function assignBlockIds(array $blocks, string $prefix): array
    {
        /** @var list<array<string, mixed>> $result */
        $result = [];

        foreach ($blocks as $index => $block) {
            $result[] = $this->assignBlockIdsToNode($block, "{$prefix}-".($index + 1));
        }

        return $result;
    }

    /**
     * @param  array<string, mixed>  $block
     * @return array<string, mixed>
     */
    private function assignBlockIdsToNode(array $block, string $prefix): array
    {
        if (! is_string($block['type'] ?? null)) {
            return $block;
        }

        $props = is_array($block['props'] ?? null) ? $block['props'] : [];

        if (! isset($props['id']) || ! is_string($props['id']) || $props['id'] === '') {
            $props['id'] = "{$prefix}-".Str::slug($block['type']);
        }

        $block['id'] = $props['id'];

        foreach ($props as $key => $value) {
            if (! is_array($value) || ! $this->isBlockList($value)) {
                continue;
            }

            $props[$key] = $this->assignBlockIds($value, "{$props['id']}-{$key}");
        }

        $block['props'] = $props;

        return $block;
    }

    /**
     * @param  array<int|string, mixed>  $value
     *
     * @phpstan-assert-if-true list<array<string, mixed>> $value
     */
    private function isBlockList(array $value): bool
    {
        if (! array_is_list($value) || $value === []) {
            return false;
        }

        foreach ($value as $item) {
            if (! is_array($item) || ! is_string($item['type'] ?? null)) {
                return false;
            }
        }

        return true;
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
            ['email' => 'intro-posts-seeder@vimaru.edu.vn'],
            [
                'name' => 'Trình tạo bài giới thiệu',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'remember_token' => Str::random(10),
            ],
        );

        return $author;
    }
}
