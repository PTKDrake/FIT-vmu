<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Actions\Realtime\DispatchCmsRealtimePingAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class PingCmsRealtimeController extends Controller
{
    public function __invoke(
        Request $request,
        DispatchCmsRealtimePingAction $dispatchCmsRealtimePingAction,
    ): JsonResponse {
        $user = $request->user();

        abort_unless($user !== null, Response::HTTP_UNAUTHORIZED);

        return response()->json([
            'status' => 'queued',
            ...$dispatchCmsRealtimePingAction($user),
        ], Response::HTTP_ACCEPTED);
    }
}
