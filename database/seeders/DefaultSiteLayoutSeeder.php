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
        $headerData = PuckSeedData::forSlot([
            [
                'type' => 'Container',
                'props' => [
                    'maxWidth' => 'xl',
                    'children' => [
                        [
                            'type' => 'Heading',
                            'props' => [
                                'title' => 'Khoa Công nghệ thông tin',
                                'subtitle' => 'Trường Đại học Hàng hải Việt Nam',
                                'fullWidthOnMobile' => true,
                                'autoWidthFromMd' => true,
                                'noShrinkFromMd' => true,
                            ],
                        ],
                        [
                            'type' => 'NavigationMenu',
                            'props' => [
                                'menuId' => '1',
                                'orientation' => 'horizontal',
                                'mobileButtonLabel' => 'Mở menu điều hướng',
                                'mobileLogoAlt' => 'FIT VMU',
                                'mobileLogoUrl' => '/logo.png',
                                'mobilePanelTitle' => 'Khoa Công nghệ thông tin',
                                'layoutPreset' => 'headerPrimary',
                                'fullWidthOnMobile' => true,
                                'growFromMd' => true,
                                'basisFromMd' => '44rem',
                                'maxWidth' => 'none',
                                'surfaceTone' => 'transparent',
                                'surfaceBorder' => 'none',
                                'surfaceRadius' => 'none',
                                'surfacePadding' => 'none',
                                'surfaceShadow' => 'none',
                                'className' => '',
                            ],
                        ],
                        [
                            'type' => 'AuthStatus',
                            'props' => [
                                'buttonLabel' => 'Đăng nhập',
                                'profileVariant' => 'compact',
                                'layoutPreset' => 'headerActions',
                                'fullWidthOnMobile' => true,
                                'autoWidthFromMd' => true,
                                'noShrinkFromMd' => true,
                                'className' => '',
                            ],
                        ],
                    ],
                ],
            ],
        ], 'site-layout-header');

        $footerData = PuckSeedData::forSlot([
            [
                'type' => 'Container',
                'props' => [
                    'maxWidth' => 'xl',
                    'children' => [
                        [
                            'type' => 'ContactInfo',
                            'props' => [
                                'title' => 'Liên hệ',
                                'address' => '484 Lạch Tray, Kênh Dương, Lê Chân, Hải Phòng',
                                'phone' => '(0225) 3829 109',
                                'email' => 'fit@vimaru.edu.vn',
                                'layoutPreset' => 'footerContact',
                                'maxWidth' => 'sm',
                                'textAlign' => 'center',
                                'textAlignFromLg' => 'left',
                                'positionFromLg' => 'start',
                                'surfaceTone' => 'transparent',
                                'surfaceBorder' => 'none',
                                'surfaceRadius' => 'none',
                                'surfacePadding' => 'none',
                                'surfaceShadow' => 'none',
                                'className' => '',
                            ],
                        ],
                        [
                            'type' => 'NavigationMenu',
                            'props' => [
                                'title' => 'Điều hướng',
                                'menuId' => '1',
                                'orientation' => 'vertical',
                                'layoutPreset' => 'footerMenu',
                                'maxWidth' => 'sm',
                                'textAlign' => 'center',
                                'textAlignFromLg' => 'left',
                                'positionFromLg' => 'end',
                                'surfaceTone' => 'transparent',
                                'surfaceBorder' => 'none',
                                'surfaceRadius' => 'none',
                                'surfacePadding' => 'none',
                                'surfaceShadow' => 'none',
                                'className' => '',
                            ],
                        ],
                        [
                            'type' => 'SocialLinks',
                            'props' => [
                                'links' => [
                                    [
                                        'platform' => 'facebook',
                                        'url' => 'https://facebook.com/groups/fitvmu',
                                        'label' => 'Facebook Group',
                                    ],
                                    [
                                        'platform' => 'youtube',
                                        'url' => 'https://youtube.com/@fitvmu',
                                        'label' => 'YouTube',
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
                                'className' => '',
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
        ], 'site-layout-footer');

        SiteLayout::query()->updateOrCreate(
            ['key' => 'default-page-layout'],
            [
                'name' => 'Bố cục trang mặc định',
                'key' => 'default-page-layout',
                'header_data' => $headerData,
                'footer_data' => $footerData,
                'left_data' => null,
                'right_data' => null,
            ],
        );
        SiteLayout::query()->updateOrCreate(
            ['key' => 'default-post-layout'],
            [
                'name' => 'Bố cục bài viết mặc định',
                'key' => 'default-post-layout',
                'header_data' => $headerData,
                'footer_data' => $footerData,
                'left_data' => null,
                'right_data' => null,
            ],
        );
    }
}
