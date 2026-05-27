<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Position;
use App\Models\Unit;
use App\Models\User;
use Inertia\Response;

final class StaffProfileCreatePageController extends Controller
{
    public function __invoke(): Response
    {
        $users = User::doesntHave('staffProfile')
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ])
            ->all();

        $units = Unit::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->all();

        $positions = Position::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->all();

        return inertia('cms/staff-profiles/create', [
            'users' => $users,
            'units' => $units,
            'positions' => $positions,
        ]);
    }
}
