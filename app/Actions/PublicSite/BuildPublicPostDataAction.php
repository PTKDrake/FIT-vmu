<?php

declare(strict_types=1);

namespace App\Actions\PublicSite;

use App\Models\Post;
use App\Models\PostCategory;
use Carbon\CarbonInterface;

class BuildPublicPostDataAction
{
    /**
     * @return array<string, mixed>
     */
    public function __invoke(Post $post): array
    {
        $post->loadMissing(['author', 'reviewer', 'thumbnail', 'categories']);

        return [
            'id' => $this->resolveModelKey($post),
            'title' => $post->title,
            'slug' => $post->slug,
            'content' => $post->content,
            'excerpt' => $post->excerpt,
            'publishedAt' => $this->formatDateTime($post->published_at),
            'authorName' => $post->author?->name,
            'reviewerName' => $post->reviewer?->name,
            'reviewedAt' => $this->formatDateTime($post->reviewed_at),
            'templateKey' => $post->template_key,
            'templateData' => $this->resolveTemplateData($post),
            'thumbnailUrl' => $post->thumbnail?->preview_url,
            'categories' => $post->categories
                ->map(fn (PostCategory $category): array => [
                    'id' => $this->resolveCategoryKey($category),
                    'name' => $category->name,
                    'slug' => $category->slug,
                ])
                ->values()
                ->all(),
        ];
    }

    private function formatDateTime(mixed $value): ?string
    {
        if ($value instanceof CarbonInterface) {
            return $value->toAtomString();
        }

        if (is_string($value) && $value !== '') {
            return $value;
        }

        return null;
    }

    private function resolveModelKey(Post $post): int
    {
        /** @var int $key */
        $key = $post->getKey();

        return $key;
    }

    private function resolveCategoryKey(PostCategory $category): int
    {
        /** @var int $key */
        $key = $category->getKey();

        return $key;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function resolveTemplateData(Post $post): ?array
    {
        $templateData = $post->getAttributeValue('template_data');

        if (! is_array($templateData)) {
            return null;
        }

        /** @var array<string, mixed> $templateData */
        return $templateData;
    }
}
