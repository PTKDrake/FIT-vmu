<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Page;
use App\Models\User;
use App\Support\PuckSeedData;
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
                'title' => 'Trang chủ khoa công nghệ thông tin',
                'excerpt' => 'Trang chủ giới thiệu Khoa Công nghệ thông tin của Trường Đại học Hàng hải Việt Nam.',
                'seo_title' => 'Trang chủ khoa công nghệ thông tin | Khoa Công nghệ thông tin',
                'seo_description' => 'Homepage được seed từ dữ liệu thật của FIT-VMU, đi qua CMS page builder và site layout builder.',
                'content' => $this->buildPageData(<<<'JSON'
{
  "root": {
    "props": {
      "title": "Trang chủ khoa công nghệ thông tin"
    }
  },
  "content": [
    {
      "type": "FeaturedHero",
      "props": {
        "id": "FeaturedHero-ff7451f9-46ff-419f-92a3-bb35080c2a84",
        "badge": "Tuyển sinh 2026",
        "title": "Đào tạo, nghiên cứu và đổi mới vì ngành hàng hải số",
        "description": "Khoa Công nghệ thông tin xây dựng chương trình đào tạo tiên tiến, gắn với thực tiễn, phát triển năng lực công nghệ, nghiên cứu ứng dụng và kết nối doanh nghiệp.",
        "imageUrl": {
          "mediaId": 31,
          "displayName": "trường-tôi-đó.jpg",
          "mimeType": "image/jpeg",
          "previewUrl": "https://fitvmu.mcmevn.com/storage/media/2026/06/01kvdm9x8r5q24psmejzmyt33w.jpg"
        },
        "primaryActionLabel": "Giới thiệu khoa",
        "primaryActionHref": "#",
        "secondaryActionLabel": "Tuyển sinh",
        "secondaryActionHref": "#",
        "className": ""
      }
    },
    {
      "type": "Container",
      "props": {
        "children": [
          {
            "type": "HighlightStats",
            "props": {
              "id": "HighlightStats-af9bfa67-f71e-4d7b-bcf8-837d21a3e67f",
              "title": "Thống kê nổi bật",
              "viewAllLabel": "Xem tất cả",
              "viewAllHref": "#",
              "stats": [
                {
                  "icon": "Calendar",
                  "value": "1997",
                  "label": "Năm thành lập"
                },
                {
                  "icon": "GraduationCap",
                  "value": "5",
                  "label": "Hướng đào tạo"
                },
                {
                  "icon": "TrendingUp",
                  "value": "30+",
                  "label": "Năm phát triển"
                },
                {
                  "icon": "Users",
                  "value": "1500+",
                  "label": "Sinh viên & học viên"
                }
              ],
              "className": ""
            }
          },
          {
            "type": "ProgramGrid",
            "props": {
              "id": "ProgramGrid-279342b8-ad82-4e33-aea2-86ad3db04b25",
              "badge": "CHƯƠNG TRÌNH ĐÀO TẠO",
              "title": "Các hướng đào tạo nổi bật",
              "description": "Các chương trình đào tạo chất lượng cao, cập nhật xu hướng công nghệ và đáp ứng nhu cầu thực tiễn của thị trường lao động.",
              "actionLabel": "Xem tất cả chương trình",
              "actionHref": "#",
              "programs": [
                {
                  "icon": "Monitor",
                  "title": "Công nghệ thông tin",
                  "description": "Trang bị kiến thức nền tảng và nâng cao về lập trình, cấu trúc dữ liệu, trí tuệ nhân tạo và các công nghệ tiên tiến.",
                  "href": "#"
                },
                {
                  "icon": "GraduationCap",
                  "title": "Hệ thống thông tin",
                  "description": "Kết hợp giữa công nghệ và quản trị để phân tích, thiết kế và triển khai các hệ thống thông tin doanh nghiệp.",
                  "href": "#"
                },
                {
                  "icon": "Code",
                  "title": "Kỹ thuật phần mềm",
                  "description": "Đào tạo chuyên sâu về phát triển phần mềm, quy trình phần mềm và kiểm thử để xây dựng sản phẩm chất lượng.",
                  "href": "#"
                },
                {
                  "icon": "Shield",
                  "title": "An toàn thông tin",
                  "description": "Trang bị kiến thức và kỹ năng bảo mật hệ thống, phân tích rủi ro và ứng phó với các mối đe dọa an ninh mạng.",
                  "href": "#"
                }
              ],
              "className": ""
            }
          },
          {
            "type": "AboutFeature",
            "props": {
              "id": "AboutFeature-22bf69c0-bf06-447f-a8e6-da09c18fcd1d",
              "badge": "• Về chúng tôi",
              "title": "Giới thiệu khoa",
              "imageUrl": {
                "mediaId": 31,
                "displayName": "trường-tôi-đó.jpg",
                "mimeType": "image/jpeg",
                "previewUrl": "https://fitvmu.mcmevn.com/storage/media/2026/06/01kvdm9x8r5q24psmejzmyt33w.jpg"
              },
              "mobileHighlightText": "Khoa Công nghệ thông tin – Trường Đại học Hàng hải Việt Nam thành lập ngày 16/12/1997, là một trong 5 khoa CNTT đầu tiên tại Việt Nam.",
              "aboutDescription": "Khoa Công nghệ thông tin – Trường Đại học Hàng hải Việt Nam là đơn vị đào tạo, nghiên cứu và chuyển giao tri thức hàng đầu trong lĩnh vực công nghệ thông tin, góp phần đào tạo nguồn nhân lực chất lượng cao, đáp ứng yêu cầu của thời đại số và hội nhập quốc tế.",
              "features": [
                {
                  "icon": "Users",
                  "title": "Đội ngũ giảng viên giàu kinh nghiệm",
                  "description": "Giảng viên giàu kinh nghiệm, tận tâm và đạt nhiều thành tích nổi bật."
                },
                {
                  "icon": "Award",
                  "title": "Chương trình đào tạo cập nhật",
                  "description": "Chương trình đào tạo hiện đại, cập nhật liên tục theo xu hướng thế giới."
                },
                {
                  "icon": "BookOpen",
                  "title": "Cơ sở vật chất hiện đại",
                  "description": "Phòng máy tính cấu hình cao, phòng Lab nghiên cứu hiện đại."
                },
                {
                  "icon": "TrendingUp",
                  "title": "Kết nối doanh nghiệp rộng mở",
                  "description": "Hợp tác chặt chẽ với các doanh nghiệp, cơ hội việc làm 100%."
                }
              ],
              "cardTitle": "Khoa Công nghệ thông tin",
              "cardSubtitle": "Trường Đại học Hàng hải Việt Nam",
              "cardHighlightText": "Nơi ươm mầm tài năng công nghệ, kiến tạo tương lai số, vươn tầm quốc tế.",
              "address": "Phòng 301, Nhà A3, 484 Lạch Tray, Ngô Quyền, Hải Phòng",
              "phone": "0225 3783 138",
              "email": "fit@vimaru.edu.vn",
              "website": "https://fit.vimaru.edu.vn",
              "buttonLabel": "Xem thêm về khoa",
              "buttonHref": "#",
              "className": "",
              "imageMaxHeight": "50"
            }
          },
          {
            "type": "Milestones",
            "props": {
              "title": "Các cột mốc phát triển",
              "milestones": [
                {
                  "icon": "Flag",
                  "years": "1997 - 1999",
                  "title": "Thành lập và khởi đầu",
                  "description": "Khoa được thành lập, xây dựng nền tảng đào tạo CNTT."
                },
                {
                  "icon": "GraduationCap",
                  "years": "2000 - 2006",
                  "title": "Mở rộng đào tạo",
                  "description": "Phát triển chương trình, tăng quy mô và đội ngũ giảng viên."
                },
                {
                  "icon": "BarChart2",
                  "years": "2007 - 2014",
                  "title": "Nâng cao chất lượng",
                  "description": "Chuẩn hóa chương trình, đẩy mạnh nghiên cứu và hợp tác."
                },
                {
                  "icon": "Globe",
                  "years": "2015 - 2020",
                  "title": "Hội nhập & đổi mới",
                  "description": "Áp dụng công nghệ mới, tăng cường hợp tác quốc tế."
                },
                {
                  "icon": "Rocket",
                  "years": "2021 - nay",
                  "title": "Phát triển bền vững",
                  "description": "Hướng tới chuyển đổi số, đào tạo nguồn nhân lực chất lượng cao."
                }
              ],
              "id": "Milestones-f8a739bf-17aa-4a7a-8563-1056a772bb7a"
            }
          },
          {
            "type": "Flex",
            "props": {
              "children": [
                {
                  "type": "FeaturedNews",
                  "props": {
                    "id": "FeaturedNews-8bce07ee-8f1a-454a-b3de-d59edd4116bc",
                    "title": "Tin tức nổi bật",
                    "viewAllLabel": "Xem tất cả",
                    "viewAllHref": "/posts",
                    "limit": 4,
                    "categoryId": "all",
                    "includedCategories": [
                      {
                        "categoryId": "1"
                      },
                      {
                        "categoryId": "2"
                      }
                    ]
                  }
                },
                {
                  "type": "FeaturedAnnouncements",
                  "props": {
                    "id": "FeaturedAnnouncements-392d5911-591a-40df-82ba-797d4f77cec7",
                    "title": "Thông báo mới nhất",
                    "actionLabel": "Xem tất cả thông báo",
                    "actionHref": "/posts",
                    "limit": 4,
                    "includedCategories": [],
                    "excludedCategories": [],
                    "className": ""
                  }
                },
                {
                  "type": "EnrollmentCta",
                  "props": {
                    "logoUrl": null,
                    "logoAlt": "Logo FIT",
                    "siteName": "Khoa CNTT",
                    "organizationName": "Trường Đại học Hàng hải Việt Nam",
                    "badge": "Tuyển sinh 2025",
                    "title": "Khám phá chương trình đào tạo – Kiến tạo tương lai số cùng Khoa CNTT",
                    "highlightWords": "tương lai số, Khoa CNTT",
                    "description": "Tham gia Khoa CNTT – Trường Đại học Hàng hải Việt Nam để học tập trong môi trường hiện đại, sáng tạo và kiến tạo sự nghiệp vững chắc trong thời đại số.",
                    "imageUrl": {
                      "mediaId": 32,
                      "displayName": "92808236605a47eb9c72f9cdddba83eb~tplv-jj85edgx6n-image-origin.jpeg",
                      "mimeType": "image/jpeg",
                      "previewUrl": "https://fitvmu.mcmevn.com/storage/media/2026/06/01kvez30cs7spfmj2n3brjcj3a.jpeg"
                    },
                    "primaryActionLabel": "Tìm hiểu tuyển sinh",
                    "primaryActionHref": "#",
                    "secondaryActionLabel": "Liên hệ tư vấn",
                    "secondaryActionHref": "#",
                    "trustItems": [
                      {
                        "icon": "Shield",
                        "label": "Đào tạo chất lượng chuẩn quốc tế"
                      },
                      {
                        "icon": "Users",
                        "label": "Đội ngũ giảng viên giàu kinh nghiệm"
                      },
                      {
                        "icon": "TrendingUp",
                        "label": "Cơ hội việc làm rộng mở"
                      }
                    ],
                    "className": "",
                    "id": "EnrollmentCta-4db743f2-e5e9-4ac8-8c02-da529abe55c6"
                  }
                }
              ],
              "flexDirection": "row",
              "mobileDirection": "column",
              "justifyContent": "start",
              "alignItems": "center",
              "gapX": "md",
              "gapY": "md",
              "wrap": true,
              "childWidth": "equal",
              "insetY": "none",
              "hideOn": "none",
              "className": "",
              "surfaceTone": "transparent",
              "surfaceBorder": "none",
              "surfaceRadius": "none",
              "surfacePadding": "none",
              "surfaceShadow": "none",
              "id": "Flex-bee72edc-1a53-4030-bd2d-cc19cf58422f"
            }
          }
        ],
        "maxWidth": "lg",
        "horizontalPadding": "md",
        "align": "center",
        "insetY": "none",
        "hideOn": "none",
        "className": "",
        "surfaceTone": "transparent",
        "surfaceBorder": "none",
        "surfaceRadius": "none",
        "surfacePadding": "md",
        "surfaceShadow": "none",
        "id": "Container-8ea2593b-7cab-4366-a57c-a37786855931"
      }
    }
  ],
  "zones": {}
}
JSON),
                'content_format' => 'puck_json',
                'visibility' => 'public',
                'thumbnail_id' => null,
                'author_id' => $author->getKey(),
                'published_at' => now(),
            ],
        );
    }

    /**
     * @param  list<array{type: string, props: array<string, mixed>}>|string  $content
     */
    private function buildPageData(array|string $content): string
    {
        return PuckSeedData::forPage($content, [], 'page-home');
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
