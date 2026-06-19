<?php

namespace App\Http\Middleware;

use App\Actions\PublicSite\PublicLayoutResolver;
use App\Actions\Puck\BuildPuckDynamicDataAction;
use App\Http\Resources\AuthenticatedUserResource;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? AuthenticatedUserResource::make($request->user()->loadMissing('staffProfile.avatar')) : null,
                'permissions' => fn (): array => $request->user()
                    ? $request->user()->getAllPermissions()->pluck('name')->sort()->values()->all()
                    : [],
                'social' => [
                    'googleEnabled' => filled(config('services.google.client_id'))
                        && filled(config('services.google.client_secret'))
                        && filled(config('services.google.redirect')),
                ],
            ],
            'features' => [
                'blocknoteAiEnabled' => $this->blockNoteAiEnabled(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => fn () => [
                'message' => $request->session()->get('message'),
                'type' => $request->session()->get('type') ?? 'success',
                'data' => $request->session()->get('data'),
            ],
            'layout' => fn () => ($defaultId = SiteSetting::defaultPageLayoutId())
                ? PublicLayoutResolver::resolve(null, $defaultId)
                : null,
            'dynamicData' => function () use ($request): array {
                $defaultId = SiteSetting::defaultPageLayoutId();
                $layout = $defaultId ? PublicLayoutResolver::resolve(null, $defaultId) : null;
                $payloads = $layout ? array_values(array_filter([
                    $layout['headerData'] ?? null,
                    $layout['footerData'] ?? null,
                    $layout['leftData'] ?? null,
                    $layout['rightData'] ?? null,
                ])) : [];

                return app(BuildPuckDynamicDataAction::class)(
                    $request->user(),
                    true,
                    $payloads
                );
            },
        ];
    }

    private function blockNoteAiEnabled(): bool
    {
        $provider = config('services.blocknote_ai.provider', 'openrouter');

        if (! is_string($provider) || $provider === '') {
            return false;
        }

        return match ($provider) {
            'nim' => filled(config('services.blocknote_ai.nim.api_key'))
                && filled(config('services.blocknote_ai.nim.model')),
            'openrouter' => filled(config('services.blocknote_ai.openrouter.api_key'))
                && filled(config('services.blocknote_ai.openrouter.model')),
            default => false,
        };
    }
}
