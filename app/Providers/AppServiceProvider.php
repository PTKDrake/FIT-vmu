<?php

declare(strict_types=1);

namespace App\Providers;

use App\Actions\PublicSite\BuildPublicPagePropsAction;
use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\User;
use App\Policies\RolePolicy;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\ExceptionResponse;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Role::class, RolePolicy::class);

        Gate::before(function (User $user, string $ability): ?bool {
            return $user->hasRole('super-admin') ? true : null;
        });

        JsonResource::withoutWrapping();
        Vite::prefetch(concurrency: 3);

        Inertia::handleExceptionsUsing(function (ExceptionResponse $response) {
            if ($response->statusCode() !== 404) {
                return null;
            }

            $notFoundPageId = SiteSetting::notFoundPageId();
            $notFoundPage = $notFoundPageId !== null ? Page::query()->find($notFoundPageId) : null;

            if (! $notFoundPage || $notFoundPage->status !== 'published' || ! $notFoundPage->isVisibleTo($response->request->user())) {
                return null;
            }

            $props = app(BuildPublicPagePropsAction::class)($notFoundPage, $response->request->user());

            return $response
                ->render('public/page', [
                    ...$props,
                    'statusCode' => 404,
                ])
                ->withSharedData();
        });
    }
}
