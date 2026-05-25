<?php

use App\Http\Requests\PublishDocumentRequest;
use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Models\Document;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('document policy separates management and access permissions', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $staffOwner = User::factory()->create();
    $staffOwner->assignRole('staff');

    $student = User::factory()->create();
    $student->assignRole('student');

    $otherStaff = User::factory()->create();
    $otherStaff->assignRole('staff');

    $draftDocument = Document::factory()->for($staffOwner, 'owner')->create([
        'status' => 'draft',
        'visibility' => 'private',
    ]);

    $publishedStudentScopedDocument = Document::factory()->create([
        'status' => 'published',
        'visibility' => 'student_code',
    ]);

    $publishedStaffDocument = Document::factory()->create([
        'status' => 'published',
        'visibility' => 'staff',
    ]);

    expect(Gate::forUser($editor)->allows('viewAny', Document::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('create', Document::class))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('update', $draftDocument))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('delete', $draftDocument))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('publish', $draftDocument))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('review', $draftDocument))->toBeTrue()
        ->and(Gate::forUser($editor)->allows('download', $publishedStaffDocument))->toBeTrue()
        ->and(Gate::forUser($staffOwner)->allows('viewAny', Document::class))->toBeTrue()
        ->and(Gate::forUser($staffOwner)->allows('create', Document::class))->toBeTrue()
        ->and(Gate::forUser($staffOwner)->allows('update', $draftDocument))->toBeTrue()
        ->and(Gate::forUser($staffOwner)->allows('delete', $draftDocument))->toBeTrue()
        ->and(Gate::forUser($staffOwner)->allows('publish', $draftDocument))->toBeFalse()
        ->and(Gate::forUser($staffOwner)->allows('review', $draftDocument))->toBeFalse()
        ->and(Gate::forUser($otherStaff)->allows('update', $draftDocument))->toBeFalse()
        ->and(Gate::forUser($otherStaff)->allows('download', $publishedStaffDocument))->toBeTrue()
        ->and(Gate::forUser($otherStaff)->allows('view', $draftDocument))->toBeFalse()
        ->and(Gate::forUser($student)->allows('view', $publishedStudentScopedDocument))->toBeTrue()
        ->and(Gate::forUser($student)->allows('download', $publishedStudentScopedDocument))->toBeTrue()
        ->and(Gate::forUser($student)->allows('download', $publishedStaffDocument))->toBeFalse();
});

test('store document request authorizes only users who can create documents', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $student = User::factory()->create();
    $student->assignRole('student');

    expect(makeStoreDocumentRequest([], $editor)->authorize())->toBeTrue()
        ->and(makeStoreDocumentRequest([], $staff)->authorize())->toBeTrue()
        ->and(makeStoreDocumentRequest([], $student)->authorize())->toBeFalse();
});

test('update and publish document requests authorize against the target document policy', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $staffOwner = User::factory()->create();
    $staffOwner->assignRole('staff');

    $student = User::factory()->create();
    $student->assignRole('student');

    $document = Document::factory()->for($staffOwner, 'owner')->create();

    expect(makeUpdateDocumentRequest([], $editor, $document)->authorize())->toBeTrue()
        ->and(makeUpdateDocumentRequest([], $staffOwner, $document)->authorize())->toBeTrue()
        ->and(makeUpdateDocumentRequest([], $student, $document)->authorize())->toBeFalse()
        ->and(makePublishDocumentRequest([], $editor, $document)->authorize())->toBeTrue()
        ->and(makePublishDocumentRequest([], $staffOwner, $document)->authorize())->toBeFalse();
});

test('store document request validates document domain fields', function () {
    $existingDocument = Document::factory()->create(['slug' => 'existing-document']);

    $validData = [
        'title' => 'De cuong hoc phan',
        'slug' => 'de-cuong-hoc-phan-moi',
        'description' => '{"type":"doc"}',
        'description_format' => 'blocknote_json',
        'file_id' => $existingDocument->file_id,
        'owner_id' => $existingDocument->owner_id,
        'document_type' => 'lecture',
        'visibility' => 'students',
        'status' => 'draft',
        'document_mode' => 'file',
    ];

    expect(validateDocumentRequest(makeStoreDocumentRequest($validData), $validData)->passes())->toBeTrue()
        ->and(validateDocumentRequest(makeStoreDocumentRequest([
            ...$validData,
            'slug' => 'existing-document',
        ]), [
            ...$validData,
            'slug' => 'existing-document',
        ])->errors()->keys())->toContain('slug')
        ->and(validateDocumentRequest(makeStoreDocumentRequest([
            ...$validData,
            'visibility' => 'campus_only',
        ]), [
            ...$validData,
            'visibility' => 'campus_only',
        ])->errors()->keys())->toContain('visibility')
        ->and(validateDocumentRequest(makeStoreDocumentRequest([
            ...$validData,
            'document_mode' => 'inline',
        ]), [
            ...$validData,
            'document_mode' => 'inline',
        ])->errors()->keys())->toContain('document_mode')
        ->and(validateDocumentRequest(makeStoreDocumentRequest([
            ...$validData,
            'status' => 'published',
        ]), [
            ...$validData,
            'status' => 'published',
        ])->errors()->keys())->toContain('status');
});

test('update request keeps the current slug and publish request restricts final statuses', function () {
    $document = Document::factory()->create(['slug' => 'keep-this-document-slug']);

    $updateData = [
        'title' => 'Updated document title',
        'slug' => 'keep-this-document-slug',
        'description' => null,
        'description_format' => 'blocknote_json',
        'file_id' => $document->file_id,
        'owner_id' => $document->owner_id,
        'document_type' => 'exam',
        'visibility' => 'staff',
        'status' => 'pending',
        'document_mode' => 'preview',
    ];

    $publishData = [
        'status' => 'published',
        'published_at' => now()->toDateTimeString(),
    ];

    expect(validateDocumentRequest(makeUpdateDocumentRequest($updateData, null, $document), $updateData)->passes())->toBeTrue()
        ->and(validateDocumentRequest(makePublishDocumentRequest($publishData, null, $document), $publishData)->passes())->toBeTrue()
        ->and(validateDocumentRequest(makePublishDocumentRequest([
            'status' => 'pending',
        ], null, $document), [
            'status' => 'pending',
        ])->errors()->keys())->toContain('status');
});

function makeStoreDocumentRequest(array $data, ?User $user = null): StoreDocumentRequest
{
    /** @var StoreDocumentRequest $request */
    $request = StoreDocumentRequest::create('/documents', 'POST', $data);
    $request->setUserResolver(static fn (): ?User => $user);

    return $request;
}

function makeUpdateDocumentRequest(array $data, ?User $user = null, ?Document $document = null): UpdateDocumentRequest
{
    /** @var UpdateDocumentRequest $request */
    $request = UpdateDocumentRequest::create('/documents/'.($document?->getKey() ?? 'document'), 'PUT', $data);
    $request->setUserResolver(static fn (): ?User => $user);
    $request->setRouteResolver(static fn (): object => routeWithDocumentParameter($document));

    return $request;
}

function makePublishDocumentRequest(array $data, ?User $user = null, ?Document $document = null): PublishDocumentRequest
{
    /** @var PublishDocumentRequest $request */
    $request = PublishDocumentRequest::create('/documents/'.($document?->getKey() ?? 'document').'/publish', 'PATCH', $data);
    $request->setUserResolver(static fn (): ?User => $user);
    $request->setRouteResolver(static fn (): object => routeWithDocumentParameter($document));

    return $request;
}

function routeWithDocumentParameter(?Document $document): object
{
    return new class($document)
    {
        public function __construct(private readonly ?Document $document) {}

        public function parameter(string $name, mixed $default = null): mixed
        {
            if ($name === 'document') {
                return $this->document ?? $default;
            }

            return $default;
        }
    };
}

function validateDocumentRequest(StoreDocumentRequest|UpdateDocumentRequest|PublishDocumentRequest $request, array $data)
{
    return Validator::make($data, $request->rules());
}
