<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\StreamBlockNoteAiRequest;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Process\Process;
use Throwable;

class StreamBlockNoteAiController extends Controller
{
    public function __invoke(StreamBlockNoteAiRequest $request): Response|StreamedResponse
    {
        $provider = config('services.blocknote_ai.provider', 'openrouter');
        $nodeBinary = config('services.blocknote_ai.node_binary', 'node');
        $timeout = config('services.blocknote_ai.timeout', 90);
        $scriptPath = base_path('web/lib/ai/blocknote-server.mjs');

        if (! is_string($provider) || $provider === '') {
            $provider = 'openrouter';
        }

        $providerConfig = match ($provider) {
            'nim' => [
                'api_key' => config('services.blocknote_ai.nim.api_key'),
                'base_url' => config('services.blocknote_ai.nim.base_url', 'https://integrate.api.nvidia.com/v1'),
                'model' => config('services.blocknote_ai.nim.model'),
            ],
            'openrouter' => [
                'api_key' => config('services.blocknote_ai.openrouter.api_key'),
                'app_name' => config('services.blocknote_ai.openrouter.app_name', config('app.name')),
                'app_url' => config('services.blocknote_ai.openrouter.app_url', config('app.url')),
                'model' => config('services.blocknote_ai.openrouter.model'),
            ],
            default => [],
        };

        $apiKey = $providerConfig['api_key'] ?? null;
        $model = $providerConfig['model'] ?? null;

        if (! is_string($apiKey) || $apiKey === '' || ! is_string($model) || $model === '') {
            return response('BlockNote AI is not configured.', 503, [
                'Content-Type' => 'text/plain; charset=UTF-8',
            ]);
        }

        if (! is_string($nodeBinary) || $nodeBinary === '') {
            $nodeBinary = 'node';
        }

        if (! is_int($timeout)) {
            $timeout = is_numeric($timeout) ? (int) $timeout : 90;
        }

        if (! is_file($scriptPath)) {
            Log::error('BlockNote AI bridge script is missing.', [
                'script_path' => $scriptPath,
            ]);

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

        return response()->stream(function () use ($provider, $providerConfig, $apiKey, $model, $nodeBinary, $payload, $scriptPath, $timeout): void {
            $startedAt = microtime(true);
            $stderrOutput = '';

            try {
                $environment = [
                    'BLOCKNOTE_AI_API_KEY' => $apiKey,
                    'BLOCKNOTE_AI_MODEL' => $model,
                    'BLOCKNOTE_AI_PROVIDER' => $provider,
                ];

                if ($provider === 'nim') {
                    $baseUrl = $providerConfig['base_url'] ?? 'https://integrate.api.nvidia.com/v1';

                    if (is_string($baseUrl) && $baseUrl !== '') {
                        $environment['BLOCKNOTE_AI_BASE_URL'] = $baseUrl;
                    }
                }

                if ($provider === 'openrouter') {
                    $appName = $providerConfig['app_name'] ?? '';
                    $appUrl = $providerConfig['app_url'] ?? '';

                    if (is_string($appName) && $appName !== '') {
                        $environment['BLOCKNOTE_AI_APP_NAME'] = $appName;
                    }

                    if (is_string($appUrl) && $appUrl !== '') {
                        $environment['BLOCKNOTE_AI_APP_URL'] = $appUrl;
                    }
                }

                $process = new Process(
                    [$nodeBinary, $scriptPath],
                    base_path(),
                    $environment,
                    json_encode($payload, JSON_THROW_ON_ERROR),
                    $timeout,
                );

                $streamResult = $this->streamBridgeProcess($process);
                $stderrOutput = $streamResult['stderr'];
                $durationMs = (int) round((microtime(true) - $startedAt) * 1000);

                if ($streamResult['aborted']) {
                    Log::notice('BlockNote AI stream was aborted by the client.', [
                        'duration_ms' => $durationMs,
                    ]);

                    return;
                }

                $this->logBridgeStderr($stderrOutput, $durationMs);

                if (! $process->isSuccessful()) {
                    Log::error('BlockNote AI bridge process exited unsuccessfully.', [
                        'duration_ms' => $durationMs,
                        'exit_code' => $process->getExitCode(),
                        'error_output' => mb_substr(trim($process->getErrorOutput()), 0, 4000),
                    ]);

                    echo $this->encodeErrorChunk('BlockNote AI bridge could not run.');
                    $this->flushStream();
                }
            } catch (Throwable $exception) {
                Log::error('BlockNote AI bridge could not run.', [
                    'duration_ms' => (int) round((microtime(true) - $startedAt) * 1000),
                    'exception' => $exception::class,
                    'message' => $exception->getMessage(),
                    'script_path' => $scriptPath,
                ]);

                echo $this->encodeErrorChunk('BlockNote AI bridge could not run.');
                $this->flushStream();
            }
        }, 200, [
            'Cache-Control' => 'no-cache, no-transform',
            'Connection' => 'keep-alive',
            'Content-Type' => 'text/event-stream; charset=UTF-8',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    /**
     * @return array{stderr: string, aborted: bool}
     */
    private function streamBridgeProcess(Process $process): array
    {
        $stderrOutput = '';

        $process->start();

        while ($process->isRunning()) {
            $stderrOutput .= $this->drainBridgeOutput($process);

            if (connection_aborted() === 1) {
                $process->stop(0.2);

                return [
                    'aborted' => true,
                    'stderr' => $stderrOutput,
                ];
            }

            usleep(50_000);
            $process->checkTimeout();
        }

        $stderrOutput .= $this->drainBridgeOutput($process);

        return [
            'aborted' => false,
            'stderr' => $stderrOutput,
        ];
    }

    private function drainBridgeOutput(Process $process): string
    {
        $output = $process->getIncrementalOutput();
        $stderrOutput = $process->getIncrementalErrorOutput();

        if ($output !== '') {
            echo $output;
            $this->flushStream();
        }

        return $stderrOutput;
    }

    private function encodeErrorChunk(string $message): string
    {
        return 'data: '.json_encode([
            'type' => 'error',
            'errorText' => $message,
        ], JSON_THROW_ON_ERROR)."\n\n";
    }

    private function logBridgeStderr(string $stderrOutput, int $durationMs): void
    {
        $lines = array_filter(array_map('trim', explode("\n", $stderrOutput)));

        foreach ($lines as $line) {
            $entry = json_decode($line, true);

            if (! is_array($entry)) {
                Log::warning('BlockNote AI bridge wrote stderr output.', [
                    'duration_ms' => $durationMs,
                    'output' => mb_substr($line, 0, 4000),
                ]);

                continue;
            }

            $level = $entry['level'] ?? 'warning';
            $message = $entry['message'] ?? 'BlockNote AI bridge log.';
            $context = $entry['context'] ?? [];

            if (! is_string($level)) {
                $level = 'warning';
            }

            if (! is_string($message)) {
                $message = 'BlockNote AI bridge log.';
            }

            if (! is_array($context)) {
                $context = [];
            }

            $context['duration_ms'] = $durationMs;

            match ($level) {
                'debug' => Log::debug($message, $context),
                'info' => Log::info($message, $context),
                'notice' => Log::notice($message, $context),
                'error' => Log::error($message, $context),
                'critical' => Log::critical($message, $context),
                'alert' => Log::alert($message, $context),
                'emergency' => Log::emergency($message, $context),
                default => Log::warning($message, $context),
            };
        }
    }

    private function flushStream(): void
    {
        if (function_exists('ob_flush')) {
            @ob_flush();
        }

        flush();
    }
}
