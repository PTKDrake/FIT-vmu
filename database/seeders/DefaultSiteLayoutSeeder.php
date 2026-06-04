<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\SiteLayout;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DefaultSiteLayoutSeeder extends Seeder
{
    public function run(): void
    {
        $defaultHeader = $this->buildSlotData([
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
                                'className' => 'py-3 sm:py-4',
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
        ]);
        $defaultFooter = $this->buildSlotData([
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
                                'className' => 'py-6',
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
        ]);
        SiteLayout::query()->updateOrCreate(
            ['key' => 'default-page-layout'],
            [
                'name' => 'Bố cục trang mặc định',
                'key' => 'default-page-layout',
                'header_data' => $defaultHeader,
                'footer_data' => $defaultFooter,
                'left_data' => null,
                'right_data' => null,
            ],
        );
        SiteLayout::query()->updateOrCreate(
            ['key' => 'default-post-layout'],
            [
                'name' => 'Bố cục bài viết mặc định',
                'key' => 'default-post-layout',
                'header_data' => $defaultHeader,
                'footer_data' => $defaultFooter,
                'left_data' => null,
                'right_data' => null,
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
}
