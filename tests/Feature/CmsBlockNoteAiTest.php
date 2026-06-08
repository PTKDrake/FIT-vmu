<?php

use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('shared inertia props expose blocknote ai feature flag', function () {
    config()->set('services.openrouter.api_key', null);
    config()->set('services.openrouter.blocknote_model', null);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $this->actingAs($editor)
        ->get('/cms')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('features.blocknoteAiEnabled', false)
        );
});

test('cms pages render a csrf meta tag for authenticated ai requests', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $this->actingAs($editor)
        ->get('/cms/posts/create')
        ->assertOk()
        ->assertSee('meta name="csrf-token"', false);
});

test('blocknote ai route returns service unavailable when openrouter is not configured', function () {
    config()->set('services.openrouter.api_key', null);
    config()->set('services.openrouter.blocknote_model', null);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $this->actingAs($editor)
        ->postJson('/cms/ai/blocknote', [
            'messages' => [
                [
                    'id' => 'msg-1',
                    'role' => 'user',
                    'parts' => [
                        [
                            'type' => 'text',
                            'text' => 'Help me rewrite this paragraph.',
                        ],
                    ],
                ],
            ],
            'toolDefinitions' => [
                'applyDocumentOperations' => [
                    'description' => 'Apply document operations to BlockNote.',
                    'inputSchema' => [
                        'type' => 'object',
                        'properties' => [],
                    ],
                    'outputSchema' => [
                        'type' => 'object',
                        'properties' => [],
                    ],
                ],
            ],
        ])
        ->assertStatus(503);
});

test('students cannot access the blocknote ai route', function () {
    $student = User::factory()->create();
    $student->assignRole('student');

    $this->actingAs($student)
        ->postJson('/cms/ai/blocknote', [
            'messages' => [
                [
                    'id' => 'msg-1',
                    'role' => 'user',
                    'parts' => [
                        [
                            'type' => 'text',
                            'text' => 'Help me rewrite this paragraph.',
                        ],
                    ],
                ],
            ],
            'toolDefinitions' => [
                'applyDocumentOperations' => [
                    'description' => 'Apply document operations to BlockNote.',
                    'inputSchema' => [
                        'type' => 'object',
                        'properties' => [],
                    ],
                    'outputSchema' => [
                        'type' => 'object',
                        'properties' => [],
                    ],
                ],
            ],
        ])
        ->assertForbidden();
});
