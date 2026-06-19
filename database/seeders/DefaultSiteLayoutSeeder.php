<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\SiteLayout;
use App\Support\PuckSeedData;
use Illuminate\Database\Seeder;

class DefaultSiteLayoutSeeder extends Seeder
{
    public function run(): void
    {
        $pageLayoutData = PuckSeedData::splitSiteLayout(<<<'JSON'
        {
            "root": {
                "props": {}
            },
            "content": [
                {
                "type": "SiteLayoutFrame",
                "props": {
                    "footer": [
                        {
                            "type": "SiteFooter",
                            "props": {
                            "showBrand": true,
                            "showContact": true,
                            "showQuickLinks": true,
                            "showSupportLinks": true,
                            "showSocialLinks": true,
                            "showCopyright": true,
                            "showLegalLinks": true,
                            "logoUrl": "/logo.png",
                            "logoAlt": "Logo Khoa CNTT",
                            "siteName": "Khoa CNTT",
                            "organizationName": "Trường Đại học Hàng hải Việt Nam",
                            "description": "Khoa CNTT tiên phong trong đào tạo gắn thực tiễn, phát triển năng lực công nghệ, nghiên cứu ứng dụng và kết nối doanh nghiệp.",
                            "contactTitle": "Thông tin liên hệ",
                            "address": "Phòng 301, Nhà A3, 484 Lạch Tray, Ngô Quyền, Hải Phòng",
                            "phone": "0225 3783 138",
                            "email": "fit@vimaru.edu.vn",
                            "quickLinksTitle": "Liên kết nhanh",
                            "quickLinksMenuId": "2",
                            "supportTitle": "Hỗ trợ",
                            "supportLinks": [
                                {
                                "label": "Cổng thông tin sinh viên",
                                "url": "#",
                                "icon": "users"
                                },
                                {
                                "label": "Email sinh viên",
                                "url": "mailto:fit@vimaru.edu.vn",
                                "icon": "mail"
                                },
                                {
                                "label": "Thư viện số",
                                "url": "#",
                                "icon": "book"
                                },
                                {
                                "label": "Hướng dẫn",
                                "url": "#",
                                "icon": "help"
                                }
                            ],
                            "socialTitle": "Kết nối với chúng tôi",
                            "socialLinks": [
                                {
                                "platform": "facebook",
                                "url": "https://facebook.com",
                                "label": ""
                                },
                                {
                                "platform": "youtube",
                                "url": "https://youtube.com",
                                "label": ""
                                },
                                {
                                "platform": "email",
                                "url": "mailto:fit@vimaru.edu.vn",
                                "label": ""
                                }
                            ],
                            "copyrightText": "© {year} Khoa CNTT - Trường Đại học Hàng hải Việt Nam. All rights reserved.",
                            "legalLinks": [
                                {
                                "label": "Chính sách bảo mật",
                                "url": "#"
                                },
                                {
                                "label": "Điều khoản sử dụng",
                                "url": "#"
                                },
                                {
                                "label": "Sơ đồ website",
                                "url": "#"
                                }
                            ],
                            "className": "",
                            "id": "SiteFooter-4eb723ee-fe67-4dec-a25c-37e20ed46e39"
                            }
                        }
                    ],
                    "right": [],
                    "left": [],
                    "header": [
                    {
                        "type": "SiteHeader",
                        "props": {
                        "logoUrl": "/logo.png",
                        "logoAlt": "Logo Khoa CNTT",
                        "siteName": "Khoa CNTT",
                        "organizationName": "Trường Đại học Hàng hải Việt Nam",
                        "menuId": "1",
                        "menuAriaLabel": "Menu điều hướng chính",
                        "searchHref": "/search",
                        "searchLabel": "Tìm kiếm",
                        "loginLabel": "Đăng nhập",
                        "profileLabel": "Tài khoản",
                        "className": "",
                        "id": "SiteHeader-51c792d8-e4de-40d7-8c2a-e0f2cb1f4b55"
                        }
                    }
                    ],
                    "id": "site-layout-frame"
                }
                }
            ],
            "zones": {}
        }
        JSON);

        SiteLayout::query()->updateOrCreate(
            ['key' => 'default-page-layout'],
            [
                'name' => 'Bố cục trang mặc định',
                'key' => 'default-page-layout',
                'header_data' => $pageLayoutData['header_data'],
                'footer_data' => $pageLayoutData['footer_data'],
                'left_data' => null,
                'right_data' => null,
            ],
        );

        $postSidebarData = PuckSeedData::forSlot([
            [
                'type' => 'Container',
                'props' => [
                    'maxWidth' => 'full',
                    'horizontalPadding' => 'md',
                    'align' => 'left',
                    'insetY' => 'md',
                    'stackChildren' => true,
                    'childGap' => 'lg',
                    'stickyOnDesktop' => true,
                    'stickyTop' => 'lg',
                    'className' => '',
                    'children' => [
                        [
                            'type' => 'PostFeed',
                            'props' => [
                                'title' => 'Bài viết mới nhất',
                                'limit' => 4,
                                'categoryId' => 'all',
                                'includedCategories' => [],
                                'excludedCategories' => [],
                                'layout' => 'sidebar',
                                'showCTA' => true,
                                'className' => '',
                            ],
                        ],
                        [
                            'type' => 'PostCategoryList',
                            'props' => [
                                'title' => 'Danh mục',
                                'parentId' => '',
                                'limit' => 6,
                                'layout' => 'sidebar',
                                'includedCategories' => [],
                                'excludedCategories' => [],
                                'className' => '',
                            ],
                        ],
                        [
                            'type' => 'SidebarQuickLinks',
                            'props' => [
                                'title' => 'Liên kết nhanh',
                                'links' => [
                                    [
                                        'label' => 'Tuyển sinh',
                                        'url' => '/tuyen-sinh',
                                        'icon' => 'graduation',
                                    ],
                                    [
                                        'label' => 'Chương trình đào tạo',
                                        'url' => '/chuong-trinh-dao-tao',
                                        'icon' => 'program',
                                    ],
                                    [
                                        'label' => 'Thư viện - Tài nguyên',
                                        'url' => '/thu-vien',
                                        'icon' => 'library',
                                    ],
                                    [
                                        'label' => 'Hợp tác doanh nghiệp',
                                        'url' => '/hop-tac-doanh-nghiep',
                                        'icon' => 'handshake',
                                    ],
                                ],
                                'className' => '',
                            ],
                        ],
                        [
                            'type' => 'SidebarSupport',
                            'props' => [
                                'title' => 'Cần hỗ trợ?',
                                'description' => 'Đội ngũ của Khoa CNTT luôn sẵn sàng hỗ trợ bạn.',
                                'buttonLabel' => 'Liên hệ ngay',
                                'buttonHref' => '/lien-he',
                                'className' => '',
                            ],
                        ],
                    ],
                ],
            ],
        ], 'default-post-layout-sidebar');

        SiteLayout::query()->updateOrCreate(
            ['key' => 'default-post-layout'],
            [
                'name' => 'Bố cục bài viết mặc định',
                'key' => 'default-post-layout',
                'header_data' => $pageLayoutData['header_data'],
                'footer_data' => $pageLayoutData['footer_data'],
                'left_data' => null,
                'right_data' => $postSidebarData,
            ],
        );
    }
}
