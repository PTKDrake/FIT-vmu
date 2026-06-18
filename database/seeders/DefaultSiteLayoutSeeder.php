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
        $layoutData = PuckSeedData::splitSiteLayout(<<<'JSON'
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
                            "type": "FitFooter",
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
                            "id": "FitFooter-4eb723ee-fe67-4dec-a25c-37e20ed46e39"
                            }
                        }
                    ],
                    "right": [],
                    "left": [],
                    "header": [
                    {
                        "type": "FitNavigationHeader",
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
                        "id": "FitNavigationHeader-51c792d8-e4de-40d7-8c2a-e0f2cb1f4b55"
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
                'header_data' => $layoutData['header_data'],
                'footer_data' => $layoutData['footer_data'],
                'left_data' => null,
                'right_data' => null,
            ],
        );
        SiteLayout::query()->updateOrCreate(
            ['key' => 'default-post-layout'],
            [
                'name' => 'Bố cục bài viết mặc định',
                'key' => 'default-post-layout',
                'header_data' => $layoutData['header_data'],
                'footer_data' => $layoutData['footer_data'],
                'left_data' => null,
                'right_data' => null,
            ],
        );
    }
}
