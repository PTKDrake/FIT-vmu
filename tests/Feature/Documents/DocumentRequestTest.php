<?php

declare(strict_types=1);

use App\Data\DocumentData;
use App\Http\Requests\Documents\PublishDocumentRequest;
use App\Http\Requests\Documents\StoreDocumentRequest;
use App\Http\Requests\Documents\UpdateDocumentRequest;
use App\Models\Document;
use App\Models\User;
use Carbon\CarbonImmutable;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Validator;

test('store document request authorizes users with create permission and maps to dto', function (): void {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $request = StoreDocumentRequest::create('/documents', 'POST', [
        'title' => 'Student handbook',
        'slug' => 'student-handbook',
        'description' => '{"type":"doc"}',
        'description_format' => 'blocknote_json',
        'document_type' => 'form',
        'visibility' => 'login_required',
        'status' => 'draft',
        'document_mode' => 'file',
        'published_at' => '2026-05-25T08:00:00+07:00',
    ]);
    $request->setUserResolver(fn (): User => $editor);

    expect($request->authorize())->toBeTrue();

    $validator = Validator::make($request->all(), $request->rules());

    expect($validator->passes())->toBeTrue();

    $request->setContainer($this->app);
    $request->setRedirector($this->app->make('redirect'));
    $request->validateResolved();

    $dto = $request->toDto();

    expect($dto)->toBeInstanceOf(DocumentData::class)
        ->and($dto->ownerId)->toBe($editor->id)
        ->and($dto->visibility)->toBe('login_required')
        ->and($dto->documentMode)->toBe('file')
        ->and($dto->publishedAt)->toEqual(CarbonImmutable::parse('2026-05-25T08:00:00+07:00'));
});

test('update document request ignores the current slug and requires update permission', function (): void {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $document = Document::factory()->create([
        'slug' => 'student-handbook',
    ]);

    $request = UpdateDocumentRequest::create("/documents/{$document->id}", 'PUT', [
        'title' => $document->title,
        'slug' => 'student-handbook',
        'description' => $document->description,
        'description_format' => $document->description_format,
        'file_id' => $document->file_id,
        'document_type' => $document->document_type,
        'visibility' => $document->visibility,
        'status' => $document->status,
        'document_mode' => $document->document_mode,
        'published_at' => $document->published_at?->toIso8601String(),
    ]);
    $request->setUserResolver(fn (): User => $editor);
    $request->setRouteResolver(fn (): Route => routeWithDocument('PUT', '/documents/{document}', $document));

    expect($request->authorize())->toBeTrue();

    $validator = Validator::make($request->all(), $request->rules());

    expect($validator->passes())->toBeTrue();

    $request->setContainer($this->app);
    $request->setRedirector($this->app->make('redirect'));
    $request->validateResolved();

    expect($request->toDto()->id)->toBe($document->id);
});

test('store document request rejects invalid visibility status and mode', function (): void {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $request = StoreDocumentRequest::create('/documents', 'POST', [
        'title' => 'Bad document',
        'description_format' => 'blocknote_json',
        'document_type' => 'unknown',
        'visibility' => 'secret',
        'status' => 'archived',
        'document_mode' => 'embed',
    ]);
    $request->setUserResolver(fn (): User => $editor);

    $validator = Validator::make($request->all(), $request->rules());

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('document_type'))->toBeTrue()
        ->and($validator->errors()->has('visibility'))->toBeTrue()
        ->and($validator->errors()->has('status'))->toBeTrue()
        ->and($validator->errors()->has('document_mode'))->toBeTrue();
});

test('publish document request requires publish permission and published payload', function (): void {
    $this->seed(RoleAndPermissionSeeder::class);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $document = Document::factory()->create([
        'status' => 'draft',
        'published_at' => null,
    ]);

    $request = PublishDocumentRequest::create("/documents/{$document->id}/publish", 'PATCH', [
        'status' => 'published',
        'published_at' => '2026-05-25T08:00:00+07:00',
    ]);
    $request->setUserResolver(fn (): User => $editor);
    $request->setRouteResolver(fn (): Route => routeWithDocument('PATCH', '/documents/{document}/publish', $document));

    expect($request->authorize())->toBeTrue();

    $validator = Validator::make($request->all(), $request->rules());

    expect($validator->passes())->toBeTrue();

    $request->setContainer($this->app);
    $request->setRedirector($this->app->make('redirect'));
    $request->validateResolved();

    expect($request->toDto()->status)->toBe('published');
});

function routeWithDocument(string $method, string $uri, Document $document): Route
{
    $request = Request::create(str_replace('{document}', (string) $document->id, $uri), $method);
    $route = new Route($method, $uri, fn () => null);

    $route->bind($request);
    $route->setParameter('document', $document);

    return $route;
}
