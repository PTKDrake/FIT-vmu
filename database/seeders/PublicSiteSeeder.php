<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Page;
use App\Models\SiteLayout;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PublicSiteSeeder extends Seeder
{
    public function run(): void
    {
        $author = $this->resolveAuthor();
        $layout = $this->seedDefaultSiteLayout();

        $this->seedHomepagePage($author, $layout);
    }

    private function seedDefaultSiteLayout(): SiteLayout
    {
        SiteLayout::query()->update(['is_default' => false]);

        return SiteLayout::query()->updateOrCreate(
            ['key' => 'public-default-shell'],
            [
                'name' => 'Dàn trang công khai mặc định',
                'key' => 'public-default-shell',
                'header_data' => $this->buildSlotData([
                    [
                        'type' => 'Section',
                        'props' => [
                            'id' => 'public-header-section',
                            'background' => 'transparent',
                            'paddingTop' => 'sm',
                            'paddingBottom' => 'sm',
                            'children' => [
                                [
                                    'type' => 'Container',
                                    'props' => [
                                        'id' => 'public-header-container',
                                        'maxWidth' => 'xl',
                                        'paddingX' => true,
                                        'horizontalPadding' => 'md',
                                        'children' => [
                                            [
                                                'type' => 'Flex',
                                                'props' => [
                                                    'id' => 'public-header-row',
                                                    'flexDirection' => 'row',
                                                    'mobileDirection' => 'column',
                                                    'justifyContent' => 'between',
                                                    'alignItems' => 'center',
                                                    'gapX' => 'lg',
                                                    'gapY' => 'md',
                                                    'wrap' => true,
                                                    'childWidth' => 'auto',
                                                    'children' => [
                                                        [
                                                            'type' => 'Heading',
                                                            'props' => [
                                                                'title' => 'Khoa Công nghệ thông tin',
                                                                'subtitle' => 'Trường Đại học Hàng hải Việt Nam',
                                                                'level' => 3,
                                                                'alignment' => 'left',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'NavigationMenu',
                                                            'props' => [
                                                                'title' => '',
                                                                'menuId' => '',
                                                                'orientation' => 'horizontal',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'AuthStatus',
                                                            'props' => [
                                                                'alignment' => 'right',
                                                                'buttonLabel' => 'Đăng nhập',
                                                                'showName' => true,
                                                                'showEmail' => false,
                                                                'showRegisterLink' => false,
                                                                'showCmsLink' => true,
                                                                'profileVariant' => 'compact',
                                                            ],
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]),
                'footer_data' => $this->buildSlotData([
                    [
                        'type' => 'Section',
                        'props' => [
                            'id' => 'public-footer-section',
                            'background' => 'transparent',
                            'paddingTop' => 'lg',
                            'paddingBottom' => 'lg',
                            'children' => [
                                [
                                    'type' => 'Container',
                                    'props' => [
                                        'id' => 'public-footer-container',
                                        'maxWidth' => 'xl',
                                        'paddingX' => true,
                                        'horizontalPadding' => 'md',
                                        'children' => [
                                            [
                                                'type' => 'Grid',
                                                'props' => [
                                                    'id' => 'public-footer-grid',
                                                    'mobileColumns' => 1,
                                                    'tabletColumns' => 2,
                                                    'desktopColumns' => 4,
                                                    'gapX' => 'lg',
                                                    'gapY' => 'lg',
                                                    'children' => [
                                                        [
                                                            'type' => 'ContactInfo',
                                                            'props' => [
                                                                'title' => 'Liên hệ',
                                                                'address' => "Phòng 402, Nhà A5\nSố 484 Lạch Tray, Kênh Dương, Lê Chân, Hải Phòng",
                                                                'phone' => '0225.3735138',
                                                                'email' => 'fit@vimaru.edu.vn',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'NavigationMenu',
                                                            'props' => [
                                                                'title' => 'Điều hướng',
                                                                'menuId' => '',
                                                                'orientation' => 'vertical',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'LinkList',
                                                            'props' => [
                                                                'title' => 'Liên kết nhanh',
                                                                'links' => [
                                                                    [
                                                                        'label' => 'Website VMU',
                                                                        'url' => 'https://vimaru.edu.vn',
                                                                        'openInNewTab' => true,
                                                                    ],
                                                                    [
                                                                        'label' => 'Trang FIT gốc',
                                                                        'url' => 'https://fit.vimaru.edu.vn/vi',
                                                                        'openInNewTab' => true,
                                                                    ],
                                                                ],
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'TagList',
                                                            'props' => [
                                                                'tags' => [
                                                                    ['text' => 'Công nghệ thông tin'],
                                                                    ['text' => 'Công nghệ phần mềm'],
                                                                    ['text' => 'Hệ thống thông tin'],
                                                                    ['text' => 'Mạng máy tính'],
                                                                ],
                                                            ],
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]),
                'left_data' => null,
                'right_data' => null,
                'status' => 'published',
                'is_default' => true,
            ],
        );
    }

    private function seedHomepagePage(User $author, SiteLayout $layout): void
    {
        Page::query()->updateOrCreate(
            ['slug' => 'trang-chu-vmu'],
            [
                'title' => 'Trang chủ VMU',
                'excerpt' => 'Trang chủ giới thiệu Khoa Công nghệ thông tin của Trường Đại học Hàng hải Việt Nam.',
                'seo_title' => 'Trang chủ VMU | Khoa Công nghệ thông tin',
                'seo_description' => 'Homepage được seed từ dữ liệu thật của FIT-VMU, đi qua CMS page builder và site layout builder.',
                'content' => $this->buildPageData([
                    [
                        'type' => 'HeroBanner',
                        'props' => [
                            'id' => 'homepage-hero',
                            'eyebrow' => 'Khoa Công nghệ thông tin - Trường Đại học Hàng hải Việt Nam',
                            'title' => 'Đào tạo, nghiên cứu và đổi mới vì ngành hàng hải số',
                            'description' => 'Khoa Công nghệ thông tin xây dựng chương trình đào tạo gắn thực tiễn, phát triển năng lực công nghệ, nghiên cứu ứng dụng và kết nối doanh nghiệp.',
                            'primaryActionHref' => '/gioi-thieu-vmu',
                            'primaryActionLabel' => 'Giới thiệu khoa',
                            'secondaryActionHref' => '/su-menh-va-tam-nhin',
                            'secondaryActionLabel' => 'Sứ mệnh và tầm nhìn',
                        ],
                    ],
                    [
                        'type' => 'AboutSection',
                        'props' => [
                            'id' => 'homepage-about',
                            'badge' => 'Tổng quan',
                            'header' => 'Khoa Công nghệ thông tin',
                            'description' => 'Đơn vị đào tạo, nghiên cứu và chuyển giao tri thức trong các lĩnh vực công nghệ phần mềm, hệ thống thông tin và truyền thông mạng máy tính.',
                            'unitName' => 'Khoa Công nghệ thông tin - Trường Đại học Hàng hải Việt Nam',
                            'address' => 'Phòng 402, Nhà A5, Số 484 Lạch Tray, Kênh Dương, Lê Chân, Hải Phòng',
                            'phone' => '0225.3735138',
                            'email' => 'fit@vimaru.edu.vn',
                            'imageUrl' => '',
                        ],
                    ],
                    [
                        'type' => 'FeatureGrid',
                        'props' => [
                            'id' => 'homepage-features',
                            'badge' => 'Chương trình',
                            'header' => 'Các hướng đào tạo nổi bật',
                            'description' => 'Dữ liệu seed mô phỏng cấu trúc thông tin trên site gốc để đội biên tập tiếp tục tinh chỉnh bằng Puck.',
                            'columns' => 3,
                            'features' => [
                                [
                                    'icon' => 'GraduationCap',
                                    'title' => 'Công nghệ thông tin chất lượng cao',
                                    'description' => 'Chương trình định hướng thực hành, tăng cường ngoại ngữ và kỹ năng nghề nghiệp.',
                                ],
                                [
                                    'icon' => 'Laptop',
                                    'title' => 'Công nghệ phần mềm',
                                    'description' => 'Trang bị tư duy thiết kế, triển khai và vận hành hệ thống phần mềm hiện đại.',
                                ],
                                [
                                    'icon' => 'Globe',
                                    'title' => 'Hệ thống thông tin',
                                    'description' => 'Tập trung vào dữ liệu, quy trình nghiệp vụ và các nền tảng số cho doanh nghiệp.',
                                ],
                            ],
                        ],
                    ],
                    [
                        'type' => 'StatsSection',
                        'props' => [
                            'id' => 'homepage-stats',
                            'badge' => 'Số liệu nhanh',
                            'header' => 'Những mốc đáng chú ý',
                            'description' => 'Một số con số và cột mốc được trích từ nội dung tham khảo và dữ liệu seed của dự án.',
                            'stats' => [
                                [
                                    'value' => '1997',
                                    'label' => 'Năm thành lập Khoa CNTT',
                                    'trendValue' => '18/12',
                                    'isPositive' => true,
                                ],
                                [
                                    'value' => '5',
                                    'label' => 'Hướng đào tạo nổi bật',
                                    'trendValue' => 'Đại học + sau đại học',
                                    'isPositive' => true,
                                ],
                                [
                                    'value' => '30+',
                                    'label' => 'Năm phát triển và tích lũy',
                                    'trendValue' => 'Đào tạo - nghiên cứu - phục vụ',
                                    'isPositive' => true,
                                ],
                            ],
                        ],
                    ],
                    [
                        'type' => 'TimelineSection',
                        'props' => [
                            'id' => 'homepage-timeline',
                            'badge' => 'Hành trình',
                            'header' => 'Các cột mốc phát triển',
                            'description' => 'Lộ trình khái quát hóa dữ liệu để homepage có chiều sâu nội dung ngay từ seed.',
                            'steps' => [
                                [
                                    'title' => '1996 - 1997',
                                    'description' => 'Hình thành nền tảng đào tạo CNTT và phát triển thành Khoa Công nghệ thông tin.',
                                ],
                                [
                                    'title' => 'Giai đoạn mở rộng',
                                    'description' => 'Mở rộng các hướng đào tạo, tăng cường gắn kết với doanh nghiệp và nghiên cứu ứng dụng.',
                                ],
                                [
                                    'title' => 'Hiện tại',
                                    'description' => 'Đẩy mạnh chuyển đổi số, chuẩn hóa dữ liệu và vận hành toàn bộ nội dung qua CMS.',
                                ],
                            ],
                        ],
                    ],
                    [
                        'type' => 'LatestPosts',
                        'props' => [
                            'id' => 'homepage-latest-posts',
                            'title' => 'Tin tức mới nhất',
                            'limit' => 4,
                            'categoryId' => 'all',
                            'layout' => 'grid',
                            'showCTA' => true,
                        ],
                    ],
                    [
                        'type' => 'LatestAnnouncements',
                        'props' => [
                            'id' => 'homepage-latest-announcements',
                            'title' => 'Thông báo nổi bật',
                            'limit' => 4,
                            'layout' => 'list',
                            'showCTA' => true,
                        ],
                    ],
                    [
                        'type' => 'CTASection',
                        'props' => [
                            'id' => 'homepage-cta',
                            'header' => 'Sẵn sàng khám phá hệ sinh thái FIT-VMU?',
                            'description' => 'Toàn bộ homepage đã được seed bằng layout và page chuẩn để đội biên tập có thể tiếp tục hoàn thiện nội dung thật trong CMS.',
                            'primaryActionLabel' => 'Xem trang giới thiệu',
                            'primaryActionHref' => '/gioi-thieu-vmu',
                            'secondaryActionLabel' => 'Xem website gốc',
                            'secondaryActionHref' => 'https://fit.vimaru.edu.vn/vi',
                        ],
                    ],
                ]),
                'content_format' => 'puck_json',
                'visibility' => 'public',
                'site_layout_id' => $layout->getKey(),
                'thumbnail_id' => null,
                'author_id' => $author->getKey(),
                'status' => 'published',
                'published_at' => now(),
            ],
        );
    }

    /**
     * @param  list<array{type: string, props: array<string, mixed>}>  $content
     */
    private function buildSlotData(array $content): string
    {
        return json_encode([
            'root' => [
                'props' => [],
            ],
            'content' => $this->assignBlockIds($content, 'site-layout-slot'),
            'zones' => [],
        ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    }

    /**
     * @param  list<array{type: string, props: array<string, mixed>}>  $content
     */
    private function buildPageData(array $content): string
    {
        return json_encode([
            'root' => [
                'props' => [
                    'title' => 'Trang chủ VMU',
                ],
            ],
            'content' => $this->assignBlockIds($content, 'page-home'),
            'zones' => [],
        ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    }

    /**
     * @param  list<array<string, mixed>>  $blocks
     * @return list<array<string, mixed>>
     */
    private function assignBlockIds(array $blocks, string $prefix): array
    {
        /** @var list<array<string, mixed>> $blocksWithIds */
        $blocksWithIds = array_map(
            fn (array $block, int $index): array => $this->assignBlockIdsToNode($block, "{$prefix}-".($index + 1)),
            $blocks,
            array_keys($blocks),
        );

        return $blocksWithIds;
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
            ['email' => 'public-site-seeder@vimaru.edu.vn'],
            [
                'name' => 'Trình tạo site công khai',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'remember_token' => Str::random(10),
            ],
        );

        return $author;
    }
}
