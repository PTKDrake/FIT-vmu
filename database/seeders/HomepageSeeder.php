<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Page;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class HomepageSeeder extends Seeder
{
    public function run(): void
    {
        $author = $this->resolveAuthor();

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
                        'type' => 'Container',
                        'props' => [
                            'id' => 'homepage-features-container',
                            'maxWidth' => 'xl',
                            'horizontalPadding' => 'md',
                            'children' => [
                                [
                                    'type' => 'Flex',
                                    'props' => [
                                        'id' => 'homepage-features-stack',
                                        'flexDirection' => 'column',
                                        'mobileDirection' => 'column',
                                        'gapY' => 'lg',
                                        'alignItems' => 'stretch',
                                        'insetY' => 'sm',
                                        'children' => [
                                            [
                                                'type' => 'Heading',
                                                'props' => [
                                                    'id' => 'homepage-features-heading',
                                                    'title' => 'Các hướng đào tạo nổi bật',
                                                    'subtitle' => 'Chương trình đào tạo',
                                                    'level' => 2,
                                                    'alignment' => 'left',
                                                ],
                                            ],
                                            [
                                                'type' => 'RichText',
                                                'props' => [
                                                    'id' => 'homepage-features-description',
                                                    'body' => '<p>Chương trình đào tạo được thiết kế hiện đại, cập nhật liên tục theo xu hướng công nghệ toàn cầu và nhu cầu thị trường lao động.</p>',
                                                ],
                                            ],
                                            [
                                                'type' => 'Grid',
                                                'props' => [
                                                    'id' => 'homepage-features-grid',
                                                    'mobileColumns' => 1,
                                                    'tabletColumns' => 2,
                                                    'desktopColumns' => 2,
                                                    'gapX' => 'lg',
                                                    'gapY' => 'lg',
                                                    'children' => [
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-features-note-1',
                                                                'title' => 'Công nghệ thông tin chất lượng cao',
                                                                'body' => 'Chương trình định hướng thực hành, tăng cường ngoại ngữ và kỹ năng nghề nghiệp.',
                                                                'intent' => 'info',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-features-note-2',
                                                                'title' => 'Công nghệ phần mềm',
                                                                'body' => 'Trang bị tư duy thiết kế, triển khai và vận hành hệ thống phần mềm hiện đại.',
                                                                'intent' => 'success',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-features-note-3',
                                                                'title' => 'Hệ thống thông tin',
                                                                'body' => 'Tập trung vào dữ liệu, quy trình nghiệp vụ và các nền tảng số cho doanh nghiệp.',
                                                                'intent' => 'warning',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-features-note-4',
                                                                'title' => 'An toàn thông tin',
                                                                'body' => 'Đào tạo chuyên sâu về bảo mật hệ thống, kiểm thử xâm nhập và quản trị rủi ro.',
                                                                'intent' => 'danger',
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
                        'type' => 'Container',
                        'props' => [
                            'id' => 'homepage-about-container',
                            'maxWidth' => 'xl',
                            'horizontalPadding' => 'md',
                            'children' => [
                                [
                                    'type' => 'Grid',
                                    'props' => [
                                        'id' => 'homepage-about-grid',
                                        'mobileColumns' => 1,
                                        'tabletColumns' => 1,
                                        'desktopColumns' => 2,
                                        'gapX' => 'xl',
                                        'gapY' => 'lg',
                                        'insetY' => 'sm',
                                        'children' => [
                                            [
                                                'type' => 'Flex',
                                                'props' => [
                                                    'id' => 'homepage-about-stack',
                                                    'flexDirection' => 'column',
                                                    'mobileDirection' => 'column',
                                                    'gapY' => 'md',
                                                    'alignItems' => 'stretch',
                                                    'children' => [
                                                        [
                                                            'type' => 'Heading',
                                                            'props' => [
                                                                'id' => 'homepage-about-heading',
                                                                'title' => 'Khoa Công nghệ thông tin',
                                                                'subtitle' => 'Từ năm 1997',
                                                                'level' => 2,
                                                                'alignment' => 'left',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'RichText',
                                                            'props' => [
                                                                'id' => 'homepage-about-copy',
                                                                'body' => '<p>Thành lập ngày 18/12/1997, tiền thân là Trung tâm CNTT (17/9/1996). Khoa là một trong 6 khoa CNTT được thành lập sớm nhất cả nước, hiện đào tạo 3 chuyên ngành đại học chính quy và thạc sỹ với 5 bộ môn chuyên môn.</p><p><strong>Đơn vị:</strong> Khoa Công nghệ thông tin - Trường Đại học Hàng hải Việt Nam.</p>',
                                                            ],
                                                        ],
                                                    ],
                                                ],
                                            ],
                                            [
                                                'type' => 'Note',
                                                'props' => [
                                                    'id' => 'homepage-about-contact',
                                                    'title' => 'Thông tin liên hệ',
                                                    'body' => "Phòng 301, Nhà A3, Số 484 Lạch Tray, Kênh Dương, Lê Chân, Hải Phòng.\nĐiện thoại: 0225.3735725\nEmail: fit@vimaru.edu.vn",
                                                    'intent' => 'info',
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
                            'id' => 'homepage-stats-container',
                            'maxWidth' => 'xl',
                            'horizontalPadding' => 'md',
                            'children' => [
                                [
                                    'type' => 'Flex',
                                    'props' => [
                                        'id' => 'homepage-stats-stack',
                                        'flexDirection' => 'column',
                                        'mobileDirection' => 'column',
                                        'gapY' => 'lg',
                                        'alignItems' => 'stretch',
                                        'children' => [
                                            [
                                                'type' => 'Heading',
                                                'props' => [
                                                    'id' => 'homepage-stats-heading',
                                                    'title' => 'Những mốc đáng chú ý',
                                                    'subtitle' => 'Số liệu nhanh',
                                                    'level' => 2,
                                                    'alignment' => 'center',
                                                ],
                                            ],
                                            [
                                                'type' => 'RichText',
                                                'props' => [
                                                    'id' => 'homepage-stats-description',
                                                    'body' => '<p class="text-center">Những con số phản ánh hành trình phát triển bền vững và những thành tựu nổi bật của Khoa.</p>',
                                                ],
                                            ],
                                            [
                                                'type' => 'Grid',
                                                'props' => [
                                                    'id' => 'homepage-stats-grid',
                                                    'mobileColumns' => 1,
                                                    'tabletColumns' => 2,
                                                    'desktopColumns' => 4,
                                                    'gapX' => 'lg',
                                                    'gapY' => 'lg',
                                                    'children' => [
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-stats-note-1',
                                                                'title' => '1997',
                                                                'body' => 'Năm thành lập Khoa CNTT\n18/12/1997',
                                                                'intent' => 'info',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-stats-note-2',
                                                                'title' => '1.050',
                                                                'body' => 'Sinh viên đang theo học\n3 chuyên ngành ĐH + Thạc sỹ',
                                                                'intent' => 'success',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-stats-note-3',
                                                                'title' => '400+',
                                                                'body' => 'Máy tính & thiết bị\nPhục vụ thực hành, thí nghiệm',
                                                                'intent' => 'warning',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-stats-note-4',
                                                                'title' => '28',
                                                                'body' => 'Năm phát triển\n1997 - 2025',
                                                                'intent' => 'danger',
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
                        'type' => 'Container',
                        'props' => [
                            'id' => 'homepage-timeline-container',
                            'maxWidth' => 'xl',
                            'horizontalPadding' => 'md',
                            'children' => [
                                [
                                    'type' => 'Flex',
                                    'props' => [
                                        'id' => 'homepage-timeline-stack',
                                        'flexDirection' => 'column',
                                        'mobileDirection' => 'column',
                                        'gapY' => 'lg',
                                        'alignItems' => 'stretch',
                                        'insetY' => 'sm',
                                        'children' => [
                                            [
                                                'type' => 'Heading',
                                                'props' => [
                                                    'id' => 'homepage-timeline-heading',
                                                    'title' => 'Các cột mốc phát triển',
                                                    'subtitle' => 'Hành trình',
                                                    'level' => 2,
                                                    'alignment' => 'left',
                                                ],
                                            ],
                                            [
                                                'type' => 'RichText',
                                                'props' => [
                                                    'id' => 'homepage-timeline-description',
                                                    'body' => '<p>Từ những ngày đầu thành lập đến hành trình chuyển đổi số toàn diện.</p>',
                                                ],
                                            ],
                                            [
                                                'type' => 'Grid',
                                                'props' => [
                                                    'id' => 'homepage-timeline-grid',
                                                    'mobileColumns' => 1,
                                                    'tabletColumns' => 2,
                                                    'desktopColumns' => 2,
                                                    'gapX' => 'lg',
                                                    'gapY' => 'lg',
                                                    'children' => [
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-timeline-note-1',
                                                                'title' => '1996 - 1997: Trung tâm CNTT & thành lập Khoa',
                                                                'body' => 'Ngày 17/9/1996 thành lập Trung tâm CNTT, đào tạo hệ Cao đẳng và giảng Tin học đại cương. Ngày 18/12/1997 chính thức thành lập Khoa CNTT, là một trong 6 khoa CNTT sớm nhất cả nước.',
                                                                'intent' => 'info',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-timeline-note-2',
                                                                'title' => '1998 - 2007: Khóa đại học đầu tiên & dừng hệ Cao đẳng',
                                                                'body' => 'Khóa đại học chính quy đầu tiên CNT39ĐH (1998-2002). Đến năm 2007-2008, Khoa dừng tuyển sinh Cao đẳng, tập trung vào Đại học chính quy với quy mô 2-3 lớp/năm.',
                                                                'intent' => 'success',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-timeline-note-3',
                                                                'title' => '2012 - 2013: Đào tạo theo 3 chuyên ngành hẹp',
                                                                'body' => 'Từ khóa K54, Khoa đào tạo theo 3 chuyên ngành: Công nghệ Thông tin, Kỹ thuật Phần mềm, Kỹ thuật Truyền thông & Mạng máy tính; quy mô tuyển sinh đạt 200 sinh viên/năm.',
                                                                'intent' => 'warning',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-timeline-note-4',
                                                                'title' => '2013 - 2017: Đào tạo Thạc sỹ & Chất lượng cao',
                                                                'body' => 'Từ 2013, với 11 Tiến sĩ, Khoa mở hệ Thạc sỹ ngành CNTT. Năm 2016-2017 đưa vào tuyển sinh hệ Đại học chính quy chất lượng cao. Năm 2017-2018 rút ngắn thời gian đào tạo còn 4 năm theo chuẩn CDIO.',
                                                                'intent' => 'danger',
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
                        'type' => 'Container',
                        'props' => [
                            'id' => 'homepage-news-container',
                            'maxWidth' => 'xl',
                            'horizontalPadding' => 'md',
                            'children' => [
                                [
                                    'type' => 'Flex',
                                    'props' => [
                                        'id' => 'homepage-news-stack',
                                        'flexDirection' => 'column',
                                        'mobileDirection' => 'column',
                                        'gapY' => 'lg',
                                        'alignItems' => 'stretch',
                                        'insetY' => 'sm',
                                        'children' => [
                                            [
                                                'type' => 'Heading',
                                                'props' => [
                                                    'id' => 'homepage-news-heading',
                                                    'title' => 'Tin tức và thông báo',
                                                    'subtitle' => 'Cập nhật mới',
                                                    'level' => 2,
                                                    'alignment' => 'left',
                                                ],
                                            ],
                                            [
                                                'type' => 'Grid',
                                                'props' => [
                                                    'id' => 'homepage-news-grid',
                                                    'mobileColumns' => 1,
                                                    'tabletColumns' => 1,
                                                    'desktopColumns' => 2,
                                                    'gapX' => 'lg',
                                                    'gapY' => 'lg',
                                                    'children' => [
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
                        'type' => 'Container',
                        'props' => [
                            'id' => 'homepage-faq-container',
                            'maxWidth' => 'lg',
                            'horizontalPadding' => 'md',
                            'children' => [
                                [
                                    'type' => 'Flex',
                                    'props' => [
                                        'id' => 'homepage-faq-stack',
                                        'flexDirection' => 'column',
                                        'mobileDirection' => 'column',
                                        'gapY' => 'lg',
                                        'alignItems' => 'stretch',
                                        'insetY' => 'sm',
                                        'children' => [
                                            [
                                                'type' => 'Heading',
                                                'props' => [
                                                    'id' => 'homepage-faq-heading',
                                                    'title' => 'Câu Hỏi Thường Gặp',
                                                    'subtitle' => 'Giải đáp những thắc mắc phổ biến từ học sinh, sinh viên và phụ huynh.',
                                                    'level' => 2,
                                                    'alignment' => 'left',
                                                ],
                                            ],
                                            [
                                                'type' => 'Grid',
                                                'props' => [
                                                    'id' => 'homepage-faq-grid',
                                                    'mobileColumns' => 1,
                                                    'tabletColumns' => 1,
                                                    'desktopColumns' => 2,
                                                    'gapX' => 'lg',
                                                    'gapY' => 'lg',
                                                    'children' => [
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-faq-note-1',
                                                                'title' => 'Khoa CNTT tuyển sinh theo phương thức nào?',
                                                                'body' => 'Khoa tuyển sinh theo các phương thức: xét tuyển dựa trên kết quả thi THPT Quốc gia, xét tuyển học bạ và xét tuyển thẳng theo quy định của Bộ GD&ĐT.',
                                                                'intent' => 'info',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-faq-note-2',
                                                                'title' => 'Tỷ lệ sinh viên có việc làm sau tốt nghiệp ra sao?',
                                                                'body' => 'Trên 95% sinh viên Khoa CNTT có việc làm đúng chuyên ngành trong vòng 6 tháng sau tốt nghiệp, tại các tập đoàn công nghệ hàng đầu như FPT, Viettel, VNPT.',
                                                                'intent' => 'success',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-faq-note-3',
                                                                'title' => 'Chương trình đào tạo có thực hành không?',
                                                                'body' => 'Chương trình chú trọng thực hành với các đồ án môn học, thực tập doanh nghiệp từ năm 3, và các phòng thí nghiệm hiện đại phục vụ nghiên cứu.',
                                                                'intent' => 'warning',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-faq-note-4',
                                                                'title' => 'Có cơ hội học bổng không?',
                                                                'body' => 'Sinh viên có nhiều cơ hội nhận học bổng: học bổng khuyến khích học tập, học bổng doanh nghiệp tài trợ, và học bổng nghiên cứu khoa học với tổng giá trị hàng trăm triệu đồng mỗi năm.',
                                                                'intent' => 'danger',
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
                        'type' => 'Container',
                        'props' => [
                            'id' => 'homepage-testimonials-container',
                            'maxWidth' => 'xl',
                            'horizontalPadding' => 'md',
                            'children' => [
                                [
                                    'type' => 'Flex',
                                    'props' => [
                                        'id' => 'homepage-testimonials-stack',
                                        'flexDirection' => 'column',
                                        'mobileDirection' => 'column',
                                        'gapY' => 'lg',
                                        'alignItems' => 'stretch',
                                        'insetY' => 'sm',
                                        'children' => [
                                            [
                                                'type' => 'Heading',
                                                'props' => [
                                                    'id' => 'homepage-testimonials-heading',
                                                    'title' => 'Cựu sinh viên nói gì về FIT-VMU?',
                                                    'subtitle' => 'Cựu Sinh Viên',
                                                    'level' => 2,
                                                    'alignment' => 'left',
                                                ],
                                            ],
                                            [
                                                'type' => 'RichText',
                                                'props' => [
                                                    'id' => 'homepage-testimonials-description',
                                                    'body' => '<p>Những chia sẻ chân thực từ các thế hệ sinh viên đã trưởng thành từ Khoa Công nghệ thông tin.</p>',
                                                ],
                                            ],
                                            [
                                                'type' => 'Grid',
                                                'props' => [
                                                    'id' => 'homepage-testimonials-grid',
                                                    'mobileColumns' => 1,
                                                    'tabletColumns' => 1,
                                                    'desktopColumns' => 2,
                                                    'gapX' => 'lg',
                                                    'gapY' => 'lg',
                                                    'children' => [
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-testimonials-note-1',
                                                                'title' => 'Phạm Văn Minh',
                                                                'body' => "Senior Software Engineer - FPT Software\n\nNhững năm tháng học tập tại FIT-VMU giúp tôi xây dựng nền tảng tư duy vững chắc và tự tin hòa nhập vào môi trường công nghệ toàn cầu.",
                                                                'intent' => 'info',
                                                            ],
                                                        ],
                                                        [
                                                            'type' => 'Note',
                                                            'props' => [
                                                                'id' => 'homepage-testimonials-note-2',
                                                                'title' => 'Nguyễn Thị Mai',
                                                                'body' => "Data Analyst - Viettel Telecom\n\nGiảng viên cực kỳ nhiệt tình, luôn thúc đẩy sinh viên tham gia nghiên cứu khoa học và các dự án thực tế. Đó là bước đệm quan trọng nhất.",
                                                                'intent' => 'success',
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
                        'type' => 'Container',
                        'props' => [
                            'id' => 'homepage-cta-container',
                            'maxWidth' => 'xl',
                            'horizontalPadding' => 'md',
                            'children' => [
                                [
                                    'type' => 'Flex',
                                    'props' => [
                                        'id' => 'homepage-cta-stack',
                                        'flexDirection' => 'column',
                                        'mobileDirection' => 'column',
                                        'justifyContent' => 'center',
                                        'alignItems' => 'center',
                                        'gapY' => 'md',
                                        'insetY' => 'sm',
                                        'children' => [
                                            [
                                                'type' => 'Heading',
                                                'props' => [
                                                    'id' => 'homepage-cta-heading',
                                                    'title' => 'Sẵn sàng khám phá hệ sinh thái FIT-VMU?',
                                                    'subtitle' => 'Bắt đầu hành trình trở thành kỹ sư CNTT chất lượng cao ngay hôm nay.',
                                                    'level' => 2,
                                                    'alignment' => 'center',
                                                ],
                                            ],
                                            [
                                                'type' => 'ButtonGroup',
                                                'props' => [
                                                    'id' => 'homepage-cta-actions',
                                                    'buttons' => [
                                                        [
                                                            'text' => 'Xét tuyển trực tuyến',
                                                            'url' => '/gioi-thieu-vmu',
                                                            'variant' => 'primary',
                                                            'size' => 'md',
                                                            'openInNewTab' => false,
                                                        ],
                                                        [
                                                            'text' => 'Tải cẩm nang tuyển sinh',
                                                            'url' => '#',
                                                            'variant' => 'outline',
                                                            'size' => 'md',
                                                            'openInNewTab' => false,
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
                'content_format' => 'puck_json',
                'visibility' => 'public',
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
            ['email' => 'homepage-seeder@vimaru.edu.vn'],
            [
                'name' => 'Trình tạo homepage',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'remember_token' => Str::random(10),
            ],
        );

        return $author;
    }
}
