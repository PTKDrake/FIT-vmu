<?php

declare(strict_types=1);

use App\Data\DocumentData;
use App\Data\PositionData;
use App\Data\PostData;
use App\Data\StaffProfileData;
use App\Data\StudentData;
use App\Data\UnitData;
use App\Models\Document;
use App\Models\Position;
use App\Models\Post;
use App\Models\StaffProfile;
use App\Models\Student;
use App\Models\Unit;
use Carbon\CarbonImmutable;

test('post data can be created from arrays and models', function (): void {
    $publishedAt = CarbonImmutable::parse('2026-05-24 10:00:00');

    $fromArray = PostData::from([
        'id' => 10,
        'title' => 'VMUFit launch',
        'slug' => 'vmufit-launch',
        'excerpt' => 'Short excerpt',
        'content' => '{"type":"doc"}',
        'contentFormat' => 'blocknote_json',
        'thumbnailId' => 5,
        'authorId' => 8,
        'status' => 'draft',
        'publishedAt' => $publishedAt->toIso8601String(),
        'createdAt' => $publishedAt->toIso8601String(),
        'updatedAt' => $publishedAt->toIso8601String(),
    ]);

    expect($fromArray->publishedAt)->toEqual($publishedAt);

    $post = Post::factory()->create();
    $fromModel = PostData::from($post);

    expect($fromModel->title)->toBe($post->title)
        ->and($fromModel->contentFormat)->toBe($post->content_format)
        ->and($fromModel->publishedAt?->equalTo($post->published_at?->toImmutable()))->toBeTrue();
});

test('document data can be created from models', function (): void {
    $document = Document::factory()->create();
    $data = DocumentData::from($document);

    expect($data->title)->toBe($document->title)
        ->and($data->documentType)->toBe($document->document_type)
        ->and($data->documentMode)->toBe($document->document_mode)
        ->and($data->publishedAt?->equalTo($document->published_at?->toImmutable()))->toBeTrue();
});

test('staff profile data can be created from models', function (): void {
    $staffProfile = StaffProfile::factory()->create();
    $data = StaffProfileData::from($staffProfile);

    expect($data->fullName)->toBe($staffProfile->full_name)
        ->and($data->bioFormat)->toBe($staffProfile->bio_format)
        ->and($data->isPublic)->toBe($staffProfile->is_public)
        ->and($data->sortOrder)->toBe($staffProfile->sort_order);
});

test('student data can be created from models', function (): void {
    $student = Student::factory()->create();
    $data = StudentData::from($student);

    expect($data->studentCode)->toBe($student->student_code)
        ->and($data->className)->toBe($student->class_name)
        ->and($data->major)->toBe($student->major);
});

test('unit data can be created from models', function (): void {
    $unit = Unit::factory()->create();
    $data = UnitData::from($unit);

    expect($data->name)->toBe($unit->name)
        ->and($data->type)->toBe($unit->type)
        ->and($data->descriptionFormat)->toBe($unit->description_format)
        ->and($data->isActive)->toBe($unit->is_active);
});

test('position data can be created from models', function (): void {
    $position = Position::factory()->create();
    $data = PositionData::from($position);

    expect($data->name)->toBe($position->name)
        ->and($data->sortOrder)->toBe($position->sort_order)
        ->and($data->isActive)->toBe($position->is_active);
});
