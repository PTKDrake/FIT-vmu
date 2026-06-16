<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\HandleTheme;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withCommands([
        __DIR__.'/../app/Console/Commands',
    ])
    ->withMiddleware(function (Middleware $middleware) {
        // Uncomment this when you have sidebar state
        // $middleware->encryptCookies(except: ['sidebar:state']);
        $middleware->trustProxies(
            at: ['127.0.0.1'],
            headers: Request::HEADER_X_FORWARDED_FOR |
                Request::HEADER_X_FORWARDED_HOST |
                Request::HEADER_X_FORWARDED_PORT |
                Request::HEADER_X_FORWARDED_PROTO
        );

        $middleware->redirectUsersTo(function (Request $request): string {
            $user = $request->user();

            return $user?->can('view admin dashboard')
                ? route('cms.dashboard')
                : route('home');
        });

        $middleware->web(append: [
            HandleTheme::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
