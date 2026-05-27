<?php

declare(strict_types=1);

use App\Data\DocumentData;
use App\Data\MediaData;
use App\Data\NavigationItemData;
use App\Data\NavigationMenuData;
use App\Data\PageData;
use App\Data\PositionData;
use App\Data\PostCategoryData;
use App\Data\PostData;
use App\Data\StaffProfileData;
use App\Data\StudentData;
use App\Data\UnitData;
use App\Models\Document;
use App\Models\Media;
use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Position;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\StaffProfile;
use App\Models\Student;
use App\Models\Unit;

test('foundation data objects map scalar domain fields from models', function () {
    $student = Student::factory()->create();
    $unit = Unit::factory()->create();
    $position = Position::factory()->create();
    $postCategory = PostCategory::factory()->create();
    $navigationMenu = NavigationMenu::factory()->create();
    $navigationItem = NavigationItem::factory()->for($navigationMenu, 'menu')->create();

    $studentData = StudentData::fromModel($student);
    $unitData = UnitData::fromModel($unit);
    $positionData = PositionData::fromModel($position);
    $postCategoryData = PostCategoryData::fromModel($postCategory);
    $navigationMenuData = NavigationMenuData::fromModel($navigationMenu);
    $navigationItemData = NavigationItemData::fromModel($navigationItem);

    expect($studentData->toArray())->toMatchArray([
        'id' => $student->id,
        'userId' => $student->user_id,
        'studentCode' => $student->student_code,
        'className' => $student->class_name,
        'major' => $student->major,
    ])->and($unitData->toArray())->toMatchArray([
        'id' => $unit->id,
        'name' => $unit->name,
        'slug' => $unit->slug,
        'type' => $unit->type,
        'descriptionFormat' => $unit->description_format,
        'sortOrder' => $unit->sort_order,
        'isActive' => $unit->is_active,
    ])->and($positionData->toArray())->toMatchArray([
        'id' => $position->id,
        'name' => $position->name,
        'slug' => $position->slug,
        'sortOrder' => $position->sort_order,
        'isActive' => $position->is_active,
    ])->and($postCategoryData->toArray())->toMatchArray([
        'id' => $postCategory->id,
        'name' => $postCategory->name,
        'slug' => $postCategory->slug,
        'description' => $postCategory->description,
        'parentId' => $postCategory->parent_id,
        'sortOrder' => $postCategory->sort_order,
        'isActive' => $postCategory->is_active,
    ])->and($navigationMenuData->toArray())->toMatchArray([
        'id' => $navigationMenu->id,
        'name' => $navigationMenu->name,
        'slug' => $navigationMenu->slug,
        'location' => $navigationMenu->location,
        'isActive' => $navigationMenu->is_active,
    ])->and($navigationItemData->toArray())->toMatchArray([
        'id' => $navigationItem->id,
        'menuId' => $navigationItem->menu_id,
        'parentId' => $navigationItem->parent_id,
        'title' => $navigationItem->title,
        'type' => $navigationItem->type,
        'linkableType' => $navigationItem->linkable_type,
        'linkableId' => $navigationItem->linkable_id,
        'url' => $navigationItem->url,
        'target' => $navigationItem->target,
        'sortOrder' => $navigationItem->sort_order,
        'isActive' => $navigationItem->is_active,
    ]);
});

test('media data maps persisted media fields', function () {
    $media = Media::factory()->create();

    expect(MediaData::fromModel($media)->toArray())->toMatchArray([
        'id' => $media->id,
        'disk' => $media->disk,
        'path' => $media->path,
        'originalName' => $media->original_name,
        'displayName' => $media->display_name,
        'mimeType' => $media->mime_type,
        'size' => $media->size,
        'uploadedBy' => $media->uploaded_by,
    ]);
});

test('post document and staff profile data omit lazy relations when not loaded', function () {
    $post = Post::factory()->create();
    $document = Document::factory()->create();
    $staffProfile = StaffProfile::factory()->create();
    $page = Page::factory()->create();

    expect(PostData::fromModel($post)->toArray())->not->toHaveKey('thumbnail')
        ->and(DocumentData::fromModel($document)->toArray())->not->toHaveKey('file')
        ->and(StaffProfileData::fromModel($staffProfile)->toArray())->not->toHaveKey('avatar')
        ->and(PageData::fromModel($page)->toArray())->not->toHaveKey('thumbnail');
});

test('post document and staff profile data include loaded media relations', function () {
    $post = Post::query()->with('thumbnail')->findOrFail(Post::factory()->create()->id);
    $document = Document::query()->with('file')->findOrFail(Document::factory()->create()->id);
    $page = Page::query()->with('thumbnail')->findOrFail(Page::factory()->create()->id);
    $staffProfile = StaffProfile::query()->with('avatar')->findOrFail(
        StaffProfile::factory()->for(Media::factory(), 'avatar')->create()->id
    );

    $postData = PostData::fromModel($post)->toArray();
    $documentData = DocumentData::fromModel($document)->toArray();
    $pageData = PageData::fromModel($page)->toArray();
    $staffProfileData = StaffProfileData::fromModel($staffProfile)->toArray();

    expect($postData['thumbnail'])->toMatchArray([
        'id' => $post->thumbnail?->id,
        'path' => $post->thumbnail?->path,
    ])->and($documentData['file'])->toMatchArray([
        'id' => $document->file?->id,
        'path' => $document->file?->path,
    ])->and($pageData['thumbnail'])->toMatchArray([
        'id' => $page->thumbnail?->id,
        'path' => $page->thumbnail?->path,
    ])->and($staffProfileData['avatar'])->toMatchArray([
        'id' => $staffProfile->avatar?->id,
        'path' => $staffProfile->avatar?->path,
    ]);
});

test('page data preserves the puck content format convention', function () {
    $page = new Page([
        'title' => 'Giới thiệu',
        'slug' => 'gioi-thieu',
        'status' => 'draft',
    ]);

    expect(PageData::fromModel($page)->contentFormat)->toBe('puck_json');
});

test('example', function () {
    expect(true)->toBeTrue();
});
