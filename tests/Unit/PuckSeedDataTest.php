<?php

declare(strict_types=1);

use App\Support\PuckSeedData;

test('it normalizes page seed payloads from exported json', function () {
    $json = <<<'JSON'
{
  "root": {
    "props": {
      "title": "Trang chủ"
    }
  },
  "content": [
    {
      "type": "Container",
      "props": {
        "children": [
          {
            "type": "Heading",
            "props": {
              "title": "Xin chao",
              "subtitle": "",
              "level": 2,
              "alignment": "left"
            }
          }
        ]
      }
    }
  ]
}
JSON;

    $payload = json_decode(PuckSeedData::forPage($json), true, flags: JSON_THROW_ON_ERROR);

    expect($payload['root']['props']['title'])->toBe('Trang chủ')
        ->and($payload['content'][0]['props']['id'])->toBe('puck-page-1-container')
        ->and($payload['content'][0]['props']['children'][0]['props']['id'])->toBe('puck-page-1-container-children-1-heading')
        ->and($payload['content'][0]['id'])->toBe('puck-page-1-container')
        ->and($payload['zones'])->toBeArray();
});

test('it normalizes slot seed payloads from arrays', function () {
    $payload = json_decode(PuckSeedData::forSlot([
        [
            'type' => 'AuthStatus',
            'props' => [
                'buttonLabel' => 'Đăng nhập',
            ],
        ],
    ]), true, flags: JSON_THROW_ON_ERROR);

    expect($payload['root']['props'])->toBe([])
        ->and($payload['content'][0]['props']['id'])->toBe('puck-slot-1-authstatus');
});

test('it splits exported site layout payloads into slot strings', function () {
    $layoutJson = <<<'JSON'
{
  "root": {
    "props": {}
  },
  "content": [
    {
      "type": "SiteLayoutFrame",
      "props": {
        "id": "site-layout-frame",
        "header": [
          {
            "type": "Heading",
            "props": {
              "title": "Header",
              "subtitle": "",
              "level": 2,
              "alignment": "left"
            }
          }
        ],
        "footer": [
          {
            "type": "RichText",
            "props": {
              "body": "<p>Footer</p>"
            }
          }
        ]
      }
    }
  ]
}
JSON;

    $slots = PuckSeedData::splitSiteLayout($layoutJson);
    $header = json_decode($slots['header_data'], true, flags: JSON_THROW_ON_ERROR);
    $footer = json_decode($slots['footer_data'], true, flags: JSON_THROW_ON_ERROR);

    expect($slots)->toHaveKeys([
        'header_data',
        'left_data',
        'right_data',
        'footer_data',
    ])
        ->and($header['content'][0]['props']['id'])->toBe('site-layout-frame-header-1-heading')
        ->and($footer['content'][0]['props']['id'])->toBe('site-layout-frame-footer-1-richtext')
        ->and($slots['left_data'])->toBe('{"root":{"props":[]},"content":[],"zones":[]}');
});
