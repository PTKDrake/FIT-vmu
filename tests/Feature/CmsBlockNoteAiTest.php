<?php

use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Support\Facades\Log;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('shared inertia props expose blocknote ai feature flag', function () {
    config()->set('services.blocknote_ai.provider', 'openrouter');
    config()->set('services.blocknote_ai.openrouter.api_key', null);
    config()->set('services.blocknote_ai.openrouter.model', null);

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $this->actingAs($editor)
        ->get('/cms')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('features.blocknoteAiEnabled', false)
        );
});

test('shared inertia props enable blocknote ai when nim is configured', function () {
    config()->set('services.blocknote_ai.provider', 'nim');
    config()->set('services.blocknote_ai.nim.api_key', 'nim-test-key');
    config()->set('services.blocknote_ai.nim.model', 'deepseek-ai/deepseek-r1');

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $this->actingAs($editor)
        ->get('/cms')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('features.blocknoteAiEnabled', true)
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
    config()->set('services.blocknote_ai.provider', 'openrouter');
    config()->set('services.blocknote_ai.openrouter.api_key', null);
    config()->set('services.blocknote_ai.openrouter.model', null);

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

test('blocknote ai route logs and streams an error when bridge cannot run', function () {
    config()->set('services.blocknote_ai.provider', 'openrouter');
    config()->set('services.blocknote_ai.openrouter.api_key', 'test-openrouter-key');
    config()->set('services.blocknote_ai.openrouter.model', 'openai/gpt-test');
    config()->set('services.blocknote_ai.node_binary', '/definitely-missing-node');

    Log::shouldReceive('warning')->zeroOrMoreTimes();
    Log::shouldReceive('error')
        ->once()
        ->with('BlockNote AI bridge process exited unsuccessfully.', Mockery::on(
            fn (array $context): bool => ($context['exit_code'] ?? null) !== 0
        ));

    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $response = $this->actingAs($editor)
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
        ]);

    $response
        ->assertOk()
        ->assertStreamedContent('data: {"type":"error","errorText":"BlockNote AI bridge could not run."}'."\n\n");
});
