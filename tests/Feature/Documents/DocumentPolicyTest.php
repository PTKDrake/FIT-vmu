<?php

declare(strict_types=1);

use App\Models\Document;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Support\Facades\Gate;

test('editor can manage and review documents through policy abilities', function (): void {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $document = Document::factory()->create([
        'visibility' => 'private',
    ]);

    expect(Gate::forUser($editor)->allows('viewAny', Document::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('view', $document))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('download', $document))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('create', Document::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('update', $document))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('delete', $document))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('publish', $document))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('review', $document))->toBeTrue();
});

test('staff can manage own document and download restricted document they own', function (): void {
    $this->seed(RoleAndPermissionSeeder::class);

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $ownDocument = Document::factory()->create([
        'owner_id' => $staff->id,
        'visibility' => 'private',
    ]);

    $foreignDocument = Document::factory()->create([
        'visibility' => 'private',
    ]);

    expect(Gate::forUser($staff)->allows('create', Document::class))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('view', $ownDocument))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('download', $ownDocument))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('update', $ownDocument))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('delete', $ownDocument))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('view', $foreignDocument))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('download', $foreignDocument))->toBeTrue()
        ->and(Gate::forUser($staff)->allows('publish', $ownDocument))->toBeFalse()
        ->and(Gate::forUser($staff)->allows('review', $ownDocument))->toBeFalse();
});

test('student can only view scoped or personalized documents and cannot download restricted ones', function (): void {
    $this->seed(RoleAndPermissionSeeder::class);

    $student = User::factory()->create();
    $student->assignRole('student');

    $studentScopedDocument = Document::factory()->create([
        'visibility' => 'students',
    ]);

    $personalizedDocument = Document::factory()->create([
        'visibility' => 'student_code',
    ]);

    $privateDocument = Document::factory()->create([
        'visibility' => 'private',
    ]);

    expect(Gate::forUser($student)->allows('view', $studentScopedDocument))->toBeTrue()
        ->and(Gate::forUser($student)->allows('download', $studentScopedDocument))->toBeFalse()
        ->and(Gate::forUser($student)->allows('view', $personalizedDocument))->toBeTrue()
        ->and(Gate::forUser($student)->allows('download', $personalizedDocument))->toBeFalse()
        ->and(Gate::forUser($student)->allows('view', $privateDocument))->toBeFalse()
        ->and(Gate::forUser($student)->allows('create', Document::class))->toBeFalse();
});
