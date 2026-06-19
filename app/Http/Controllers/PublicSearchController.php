<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\PublicSite\SearchPublicContentAction;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class PublicSearchController extends Controller
{
    public function __invoke(Request $request, SearchPublicContentAction $search): JsonResponse
    {
        /** @var User|null $viewer */
        $viewer = $request->user();

        return response()->json(
            $search($request->string('q')->toString(), $viewer),
        );
    }
}
