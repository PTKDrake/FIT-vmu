<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\StreamBlockNoteAiRequest;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Process\Process;

class StreamBlockNoteAiController extends Controller
{
    public function __invoke(StreamBlockNoteAiRequest $request): Response|StreamedResponse
    {
        $apiKey = config('services.openrouter.api_key');
        $model = config('services.openrouter.blocknote_model');
        $appName = config('services.openrouter.app_name', config('app.name'));
        $appUrl = config('services.openrouter.app_url', config('app.url'));
        $scriptPath = base_path('web/lib/ai/blocknote-server.mjs');

        if (! is_string($apiKey) || $apiKey === '' || ! is_string($model) || $model === '') {
            return response('BlockNote AI is not configured.', 503, [
                'Content-Type' => 'text/plain; charset=UTF-8',
            ]);
        }

        if (! is_string($appName)) {
            $appName = '';
        }

        if (! is_string($appUrl)) {
            $appUrl = '';
        }

        if (! is_file($scriptPath)) {
            return response('BlockNote AI bridge script is missing.', 500, [
                'Content-Type' => 'text/plain; charset=UTF-8',
            ]);
        }

        /** @var array{id?: string, messageId?: string, messages: array<int, mixed>, toolDefinitions: array<string, mixed>, trigger?: string} $payload */
        $payload = $request->safe()->only([
            'id',
            'messageId',
            'messages',
            'toolDefinitions',
            'trigger',
        ]);

        return response()->stream(function () use ($apiKey, $model, $payload, $scriptPath, $appName, $appUrl): void {
            $process = new Process(
                ['node', $scriptPath],
                base_path(),
                [
                    'OPENROUTER_API_KEY' => $apiKey,
                    'OPENROUTER_BLOCKNOTE_MODEL' => $model,
                    'OPENROUTER_APP_NAME' => $appName,
                    'OPENROUTER_APP_URL' => $appUrl,
                ],
                json_encode($payload, JSON_THROW_ON_ERROR),
                120,
            );

            $process->start();

            foreach ($process as $type => $buffer) {
                if ($type === Process::ERR) {
                    Log::warning('BlockNote AI bridge stderr output.', [
                        'output' => trim($buffer),
                    ]);

                    continue;
                }

                echo $buffer;

                if (function_exists('ob_flush')) {
                    @ob_flush();
                }

                flush();
            }

            if (! $process->isSuccessful()) {
                Log::error('BlockNote AI bridge process exited unsuccessfully.', [
                    'exit_code' => $process->getExitCode(),
                    'error_output' => trim($process->getErrorOutput()),
                ]);
            }
        }, 200, [
            'Cache-Control' => 'no-cache, no-transform',
            'Connection' => 'keep-alive',
            'Content-Type' => 'text/event-stream; charset=UTF-8',
            'X-Accel-Buffering' => 'no',
        ]);
    }
}
