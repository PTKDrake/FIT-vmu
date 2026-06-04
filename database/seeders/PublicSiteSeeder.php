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
                                                    'gapY' => 'sm',
                                                    'wrap' => false,
                                                    'childWidth' => 'auto',
                                                    'children' => [
                                                        [
                                                            'type' => 'Heading',
                                                            'props' => [
                                                                'title' => 'Khoa Công nghệ thông tin',
                                                                'subtitle' => 'Trường Đại học Hàng hải Việt Nam',
                                                                'level' => 4,
                                                                'alignment' => 'left',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'NavigationMenu',
                                                            'props' => [
                                                                'title' => '',
                                                                'menuId' => '1',
                                                                'orientation' => 'horizontal',
                                                                'className' => 'flex-1 max-w-2xl',
                                                                'surfaceTone' => 'transparent',
                                                                'surfaceBorder' => 'none',
                                                                'surfaceRadius' => 'none',
                                                                'surfacePadding' => 'none',
                                                                'surfaceShadow' => 'sm',
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
                            'paddingBottom' => 'none',
                            'children' => [
                                [
                                    'type' => 'Container',
                                    'props' => [
                                        'id' => 'public-footer-container',
                                        'maxWidth' => 'full',
                                        'horizontalPadding' => 'none',
                                        'children' => [
                                            [
                                                'type' => 'Flex',
                                                'props' => [
                                                    'flexDirection' => 'row',
                                                    'mobileDirection' => 'column',
                                                    'justifyContent' => 'evenly',
                                                    'alignItems' => 'start',
                                                    'gapX' => 'md',
                                                    'gapY' => 'md',
                                                    'wrap' => false,
                                                    'childWidth' => 'full',
                                                    'hideOn' => 'none',
                                                    'className' => '',
                                                    'children' => [
                                                        [
                                                            'type' => 'ContactInfo',
                                                            'props' => [
                                                                'title' => 'Liên hệ',
                                                                'address' => "Phòng 301, Nhà A3\nSố 484 Lạch Tray, Kênh Dương, \nLê Chân, Hải Phòng",
                                                                'phone' => '0225.3735138',
                                                                'email' => 'fit@vimaru.edu.vn',
                                                                'surfaceTone' => 'transparent',
                                                                'surfaceBorder' => 'none',
                                                                'surfaceRadius' => 'none',
                                                                'surfacePadding' => 'none',
                                                                'surfaceShadow' => 'none',
                                                                'className' => 'max-w-sm',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'NavigationMenu',
                                                            'props' => [
                                                                'title' => 'Điều hướng',
                                                                'menuId' => '2',
                                                                'orientation' => 'vertical',
                                                                'surfaceTone' => 'transparent',
                                                                'surfaceBorder' => 'none',
                                                                'surfaceRadius' => 'none',
                                                                'surfacePadding' => 'none',
                                                                'surfaceShadow' => 'none',
                                                            ],
                                                        ],
                                                    ],
                                                ],
                                            ],
                                            [
                                                'type' => 'Divider',
                                                'props' => [
                                                    'id' => 'public-footer-divider',
                                                    'type' => 'solid',
                                                    'color' => 'primary',
                                                    'spacingY' => 'sm',
                                                    'width' => 'xl',
                                                    'align' => 'center',
                                                ],
                                            ],
                                            [
                                                'type' => 'SocialLinks',
                                                'props' => [
                                                    'links' => [
                                                        [
                                                            'platform' => 'facebook',
                                                            'url' => 'https://www.facebook.com/groups/fit.vimaru/',
                                                            'label' => 'Facebook Group',
                                                        ],
                                                        [
                                                            'platform' => 'facebook',
                                                            'url' => 'https://www.facebook.com/khoacntt.dhhhvn/',
                                                            'label' => 'Fanpage Khoa CNTT',
                                                        ],
                                                        [
                                                            'platform' => 'email',
                                                            'url' => 'mailto:fit@vimaru.edu.vn',
                                                            'label' => 'fit@vimaru.edu.vn',
                                                        ],
                                                    ],
                                                    'layout' => 'horizontal',
                                                    'iconSize' => 'md',
                                                    'showLabels' => true,
                                                    'surfaceTone' => 'transparent',
                                                    'surfaceBorder' => 'none',
                                                    'surfaceRadius' => 'none',
                                                    'surfacePadding' => 'none',
                                                    'surfaceShadow' => 'none',
                                                    'className' => 'flex items-center justify-center',
                                                ],
                                            ],
                                            [
                                                'type' => 'CopyrightBar',
                                                'props' => [
                                                    'text' => '© {year} Faculty of Information Technology, VMU. All rights reserved.',
                                                    'links' => [
                                                        [
                                                            'label' => 'Chính sách bảo mật',
                                                            'url' => '#',
                                                        ],
                                                        [
                                                            'label' => 'Điều khoản sử dụng',
                                                            'url' => '#',
                                                        ],
                                                    ],
                                                    'surfaceTone' => 'transparent',
                                                    'surfaceBorder' => 'none',
                                                    'surfaceRadius' => 'none',
                                                    'surfacePadding' => 'md',
                                                    'surfaceShadow' => 'none',
                                                    'className' => '',
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
                        'type' => 'Container',
                        'props' => [
                            'maxWidth' => 'xl',
                            'horizontalPadding' => 'md',
                            'align' => 'center',
                            'hideOn' => 'none',
                            'className' => '',
                            'children' => [
                                [
                                    'type' => 'HeroSplit',
                                    'props' => [
                                        'id' => 'homepage-hero',
                                        'title' => 'Đào tạo, nghiên cứu và đổi mới vì ngành hàng hải số',
                                        'description' => 'Khoa Công nghệ thông tin xây dựng chương trình đào tạo gắn thực tiễn, phát triển năng lực công nghệ, nghiên cứu ứng dụng và kết nối doanh nghiệp.',
                                        'imageUrl' => '',
                                        'primaryActionLabel' => 'Giới thiệu khoa',
                                        'primaryActionHref' => '/gioi-thieu-khoa-cong-nghe-thong-tin',
                                        'secondaryActionLabel' => 'Sứ mệnh và tầm nhìn',
                                        'secondaryActionHref' => '/su-menh-va-tam-nhin',
                                        'stats' => [
                                            ['title' => '1997', 'subtitle' => 'Năm thành lập'],
                                            ['title' => '5', 'subtitle' => 'Hướng đào tạo'],
                                            ['title' => '30+', 'subtitle' => 'Năm phát triển'],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'type' => 'Section',
                        'props' => [
                            'id' => 'homepage-features-section',
                            'background' => 'transparent',
                            'paddingTop' => 'sm',
                            'paddingBottom' => 'sm',
                            'children' => [
                                [
                                    'type' => 'Container',
                                    'props' => [
                                        'id' => 'homepage-features-container',
                                        'maxWidth' => 'xl',
                                        'horizontalPadding' => 'md',
                                        'children' => [
                                            [
                                                'type' => 'FeatureGrid',
                                                'props' => [
                                                    'id' => 'homepage-features',
                                                    'badge' => 'Chương trình đào tạo',
                                                    'header' => 'Các hướng đào tạo nổi bật',
                                                    'description' => 'Chương trình đào tạo được thiết kế hiện đại, cập nhật liên tục theo xu hướng công nghệ toàn cầu và nhu cầu thị trường lao động.',
                                                    'columns' => 3,
                                                    'features' => [
                                                        [
                                                            'icon' => 'GraduationCap',
                                                            'title' => 'Công nghệ thông tin chất lượng cao',
                                                            'description' => 'Chương trình định hướng thực hành, tăng cường ngoại ngữ và kỹ năng nghề nghiệp.',
                                                        ],
                                                        [
                                                            'icon' => 'Cpu',
                                                            'title' => 'Công nghệ phần mềm',
                                                            'description' => 'Trang bị tư duy thiết kế, triển khai và vận hành hệ thống phần mềm hiện đại.',
                                                        ],
                                                        [
                                                            'icon' => 'Globe',
                                                            'title' => 'Hệ thống thông tin',
                                                            'description' => 'Tập trung vào dữ liệu, quy trình nghiệp vụ và các nền tảng số cho doanh nghiệp.',
                                                        ],
                                                        [
                                                            'icon' => 'Shield',
                                                            'title' => 'An toàn thông tin',
                                                            'description' => 'Đào tạo chuyên sâu về bảo mật hệ thống, kiểm thử xâm nhập và quản trị rủi ro.',
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
                    [
                        'type' => 'Section',
                        'props' => [
                            'id' => 'homepage-about-section',
                            'background' => 'transparent',
                            'paddingTop' => 'sm',
                            'paddingBottom' => 'sm',
                            'children' => [
                                [
                                    'type' => 'Container',
                                    'props' => [
                                        'id' => 'homepage-about-container',
                                        'maxWidth' => 'xl',
                                        'horizontalPadding' => 'md',
                                        'children' => [
                                            [
                                                'type' => 'AboutSection',
                                                'props' => [
                                                    'id' => 'homepage-about',
                                                    'badge' => 'Từ năm 1997',
                                                    'header' => 'Khoa Công nghệ thông tin',
                                                    'description' => 'Thành lập ngày 18/12/1997, tiền thân là Trung tâm CNTT (17/9/1996). Khoa là một trong 6 khoa CNTT được thành lập sớm nhất cả nước, hiện đào tạo 3 chuyên ngành đại học chính quy và thạc sỹ với 5 bộ môn chuyên môn.',
                                                    'unitName' => 'Khoa Công nghệ thông tin - Trường Đại học Hàng hải Việt Nam',
                                                    'address' => 'Phòng 301, Nhà A3, Số 484 Lạch Tray, Kênh Dương, Lê Chân, Hải Phòng',
                                                    'phone' => '0225.3735725',
                                                    'email' => 'fit@vimaru.edu.vn',
                                                    'imageUrl' => '',
                                                    'surfaceTone' => 'overlay',
                                                    'surfaceBorder' => 'subtle',
                                                    'surfaceRadius' => '3xl',
                                                    'surfacePadding' => 'xl',
                                                    'surfaceShadow' => 'sm',
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'type' => 'Container',
                        'props' => [
                            'maxWidth' => 'xl',
                            'horizontalPadding' => 'md',
                            'align' => 'center',
                            'hideOn' => 'none',
                            'className' => '',
                            'children' => [
                                [
                                    'type' => 'StatsSection',
                                    'props' => [
                                        'id' => 'homepage-stats',
                                        'badge' => 'Số liệu nhanh',
                                        'header' => 'Những mốc đáng chú ý',
                                        'description' => 'Những con số phản ánh hành trình phát triển bền vững và những thành tựu nổi bật của Khoa.',
                                        'stats' => [
                                            [
                                                'value' => '1997',
                                                'label' => 'Năm thành lập Khoa CNTT',
                                                'trendValue' => '18/12/1997',
                                                'isPositive' => true,
                                            ],
                                            [
                                                'value' => '1.050',
                                                'label' => 'Sinh viên đang theo học',
                                                'trendValue' => '3 chuyên ngành ĐH + Thạc sỹ',
                                                'isPositive' => true,
                                            ],
                                            [
                                                'value' => '400+',
                                                'label' => 'Máy tính & thiết bị',
                                                'trendValue' => 'Phục vụ thực hành, thí nghiệm',
                                                'isPositive' => true,
                                            ],
                                            [
                                                'value' => '28',
                                                'label' => 'Năm phát triển',
                                                'trendValue' => '1997 — 2025',
                                                'isPositive' => true,
                                            ],
                                        ],
                                        'surfaceTone' => 'transparent',
                                        'surfaceBorder' => 'none',
                                        'surfaceRadius' => 'none',
                                        'surfacePadding' => 'lg',
                                        'surfaceShadow' => 'none',
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'type' => 'Section',
                        'props' => [
                            'id' => 'homepage-timeline-section',
                            'background' => 'transparent',
                            'paddingTop' => 'sm',
                            'paddingBottom' => 'sm',
                            'children' => [
                                [
                                    'type' => 'Container',
                                    'props' => [
                                        'id' => 'homepage-timeline-container',
                                        'maxWidth' => 'xl',
                                        'horizontalPadding' => 'md',
                                        'children' => [
                                            [
                                                'type' => 'TimelineSection',
                                                'props' => [
                                                    'id' => 'homepage-timeline',
                                                    'badge' => 'Hành trình',
                                                    'header' => 'Các cột mốc phát triển',
                                                    'description' => 'Từ những ngày đầu thành lập đến hành trình chuyển đổi số toàn diện.',
                                                    'steps' => [
                                                        [
                                                            'title' => '1996 — 1997: Trung tâm CNTT & thành lập Khoa',
                                                            'description' => 'Ngày 17/9/1996 thành lập Trung tâm CNTT, đào tạo hệ Cao đẳng và giảng Tin học đại cương. Ngày 18/12/1997 chính thức thành lập Khoa CNTT, là một trong 6 khoa CNTT sớm nhất cả nước.',
                                                        ],
                                                        [
                                                            'title' => '1998 — 2007: Khóa đại học đầu tiên & dừng hệ Cao đẳng',
                                                            'description' => 'Khóa đại học chính quy đầu tiên CNT39ĐH (1998-2002). Đến năm 2007-2008, Khoa dừng tuyển sinh Cao đẳng, tập trung vào Đại học chính quy với quy mô 2-3 lớp/năm.',
                                                        ],
                                                        [
                                                            'title' => '2012 — 2013: Đào tạo theo 3 chuyên ngành hẹp',
                                                            'description' => 'Từ khóa K54, Khoa đào tạo theo 3 chuyên ngành: Công nghệ Thông tin, Kỹ thuật Phần mềm, Kỹ thuật Truyền thông & Mạng máy tính; quy mô tuyển sinh đạt 200 sinh viên/năm.',
                                                        ],
                                                        [
                                                            'title' => '2013 — 2017: Đào tạo Thạc sỹ & Chất lượng cao',
                                                            'description' => 'Từ 2013, với 11 Tiến sĩ, Khoa mở hệ Thạc sỹ ngành CNTT. Năm 2016-2017 đưa vào tuyển sinh hệ Đại học chính quy chất lượng cao. Năm 2017-2018 rút ngắn thời gian đào tạo còn 4 năm theo chuẩn CDIO.',
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
                    [
                        'type' => 'Section',
                        'props' => [
                            'id' => 'homepage-news-section',
                            'background' => 'transparent',
                            'paddingTop' => 'sm',
                            'paddingBottom' => 'sm',
                            'children' => [
                                [
                                    'type' => 'Container',
                                    'props' => [
                                        'id' => 'homepage-news-container',
                                        'maxWidth' => 'xl',
                                        'horizontalPadding' => 'md',
                                        'children' => [
                                            [
                                                'type' => 'TwoColumns',
                                                'props' => [
                                                    'id' => 'homepage-news-columns',
                                                    'columnRatio' => 'equal',
                                                    'gap' => 'lg',
                                                    'stackOnMobile' => true,
                                                    'left' => [
                                                        [
                                                            'type' => 'LatestPosts',
                                                            'props' => [
                                                                'id' => 'homepage-latest-posts',
                                                                'title' => 'Tin tức mới nhất',
                                                                'limit' => 3,
                                                                'categoryId' => 'all',
                                                                'layout' => 'list',
                                                                'showCTA' => true,
                                                                'surfaceTone' => 'transparent',
                                                                'surfaceBorder' => 'none',
                                                                'surfaceRadius' => 'none',
                                                                'surfacePadding' => 'none',
                                                                'surfaceShadow' => 'none',
                                                            ],
                                                        ],
                                                    ],
                                                    'right' => [
                                                        [
                                                            'type' => 'LatestAnnouncements',
                                                            'props' => [
                                                                'id' => 'homepage-latest-announcements',
                                                                'title' => 'Thông báo nổi bật',
                                                                'limit' => 3,
                                                                'layout' => 'list',
                                                                'showCTA' => true,
                                                                'surfaceTone' => 'transparent',
                                                                'surfaceBorder' => 'none',
                                                                'surfaceRadius' => 'none',
                                                                'surfacePadding' => 'none',
                                                                'surfaceShadow' => 'none',
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
                    [
                        'type' => 'Section',
                        'props' => [
                            'id' => 'homepage-faq-section',
                            'background' => 'transparent',
                            'paddingTop' => 'sm',
                            'paddingBottom' => 'sm',
                            'children' => [
                                [
                                    'type' => 'Container',
                                    'props' => [
                                        'id' => 'homepage-faq-container',
                                        'maxWidth' => 'lg',
                                        'horizontalPadding' => 'md',
                                        'children' => [
                                            [
                                                'type' => 'FAQSection',
                                                'props' => [
                                                    'id' => 'homepage-faq',
                                                    'title' => 'Câu Hỏi Thường Gặp',
                                                    'description' => 'Giải đáp những thắc mắc phổ biến từ học sinh, sinh viên và phụ huynh.',
                                                    'items' => [
                                                        [
                                                            'question' => 'Khoa CNTT tuyển sinh theo phương thức nào?',
                                                            'answer' => 'Khoa tuyển sinh theo các phương thức: xét tuyển dựa trên kết quả thi THPT Quốc gia, xét tuyển học bạ và xét tuyển thẳng theo quy định của Bộ GD&ĐT.',
                                                        ],
                                                        [
                                                            'question' => 'Tỷ lệ sinh viên có việc làm sau tốt nghiệp ra sao?',
                                                            'answer' => 'Trên 95% sinh viên Khoa CNTT có việc làm đúng chuyên ngành trong vòng 6 tháng sau tốt nghiệp, tại các tập đoàn công nghệ hàng đầu như FPT, Viettel, VNPT.',
                                                        ],
                                                        [
                                                            'question' => 'Chương trình đào tạo có thực hành không?',
                                                            'answer' => 'Chương trình chú trọng thực hành với các đồ án môn học, thực tập doanh nghiệp từ năm 3, và các phòng thí nghiệm hiện đại phục vụ nghiên cứu.',
                                                        ],
                                                        [
                                                            'question' => 'Có cơ hội học bổng không?',
                                                            'answer' => 'Sinh viên có nhiều cơ hội nhận học bổng: học bổng khuyến khích học tập, học bổng doanh nghiệp tài trợ, và học bổng nghiên cứu khoa học với tổng giá trị hàng trăm triệu đồng mỗi năm.',
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
                    [
                        'type' => 'Section',
                        'props' => [
                            'id' => 'homepage-testimonials-section',
                            'background' => 'transparent',
                            'paddingTop' => 'sm',
                            'paddingBottom' => 'sm',
                            'children' => [
                                [
                                    'type' => 'Container',
                                    'props' => [
                                        'id' => 'homepage-testimonials-container',
                                        'maxWidth' => 'xl',
                                        'horizontalPadding' => 'md',
                                        'children' => [
                                            [
                                                'type' => 'TestimonialSection',
                                                'props' => [
                                                    'id' => 'homepage-testimonials',
                                                    'badge' => 'Cựu Sinh Viên',
                                                    'header' => 'Cựu sinh viên nói gì về FIT-VMU?',
                                                    'description' => 'Những chia sẻ chân thực từ các thế hệ sinh viên đã trưởng thành từ Khoa Công nghệ thông tin.',
                                                    'testimonials' => [
                                                        [
                                                            'name' => 'Phạm Văn Minh',
                                                            'roleAndCompany' => 'Senior Software Engineer — FPT Software',
                                                            'content' => 'Những năm tháng học tập tại FIT-VMU giúp tôi xây dựng nền tảng tư duy vững chắc và tự tin hòa nhập vào môi trường công nghệ toàn cầu.',
                                                            'avatar' => '',
                                                        ],
                                                        [
                                                            'name' => 'Nguyễn Thị Mai',
                                                            'roleAndCompany' => 'Data Analyst — Viettel Telecom',
                                                            'content' => 'Giảng viên cực kỳ nhiệt tình, luôn thúc đẩy sinh viên tham gia nghiên cứu khoa học và các dự án thực tế. Đó là bước đệm quan trọng nhất.',
                                                            'avatar' => '',
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
                    [
                        'type' => 'Section',
                        'props' => [
                            'id' => 'homepage-cta-section',
                            'background' => 'transparent',
                            'paddingTop' => 'sm',
                            'paddingBottom' => 'sm',
                            'borderRadius' => '2xl',
                            'children' => [
                                [
                                    'type' => 'Container',
                                    'props' => [
                                        'id' => 'homepage-cta-container',
                                        'maxWidth' => 'lg',
                                        'horizontalPadding' => 'md',
                                        'children' => [
                                            [
                                                'type' => 'CTASection',
                                                'props' => [
                                                    'id' => 'homepage-cta',
                                                    'header' => 'Sẵn sàng khám phá hệ sinh thái FIT-VMU?',
                                                    'description' => 'Bắt đầu hành trình trở thành kỹ sư CNTT chất lượng cao ngay hôm nay.',
                                                    'primaryActionLabel' => 'Xét tuyển trực tuyến',
                                                    'primaryActionHref' => '/gioi-thieu-vmu',
                                                    'secondaryActionLabel' => 'Tải cẩm nang tuyển sinh',
                                                    'secondaryActionHref' => '#',
                                                    'surfaceTone' => 'overlay',
                                                    'surfaceBorder' => 'subtle',
                                                    'surfaceRadius' => '3xl',
                                                    'surfacePadding' => 'xl',
                                                    'surfaceShadow' => 'sm',
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
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
