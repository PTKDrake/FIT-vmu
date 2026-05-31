<?php

declare(strict_types=1);

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\PostCategory;
use Illuminate\Http\Request;
use Inertia\Response;

final class PostCreatePageController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $categories = PostCategory::query()
            ->select(['id', 'name'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (PostCategory $cat): array => [
                'value' => (string) $cat->id,
                'label' => $cat->name,
            ])
            ->all();

        return inertia('cms/posts/create', [
            'categories' => $categories,
        ]);
    }
}
