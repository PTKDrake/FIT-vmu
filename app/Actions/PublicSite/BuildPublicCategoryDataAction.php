<?php

declare(strict_types=1);

namespace App\Actions\PublicSite;

use App\Models\Post;
use App\Models\PostCategory;
use Carbon\CarbonInterface;

class BuildPublicCategoryDataAction
{
    /**
     * @return array<string, mixed>
     */
    public function __invoke(PostCategory $category): array
    {
        return [
            'id' => $this->resolveCategoryKey($category),
            'name' => $category->name,
            'slug' => $category->slug,
            'description' => $category->description,
            'displayMode' => $category->display_mode,
            'archiveTemplateKey' => $category->archive_template_key,
            'archiveTemplateData' => $this->resolveArchiveTemplateData($category),
            'posts' => $this->buildPosts($category),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function buildPosts(PostCategory $category): array
    {
        return Post::query()
            ->select([
                'id',
                'title',
                'slug',
                'excerpt',
                'thumbnail_id',
                'author_id',
                'published_at',
                'template_key',
                'template_data',
                'status',
            ])
            ->where('status', 'published')
            ->whereHas('categories', fn ($query) => $query->whereKey($category->getKey()))
            ->with(['author:id,name', 'thumbnail:id,disk,path'])
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Post $post): array => [
                'id' => $this->resolvePostKey($post),
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'publishedAt' => $this->formatDateTime($post->published_at),
                'authorName' => $post->author?->name,
                'templateKey' => $post->template_key,
                'templateData' => $this->resolvePostTemplateData($post),
                'thumbnailUrl' => $post->thumbnail?->preview_url,
            ])
            ->values()
            ->all();
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

    private function resolveCategoryKey(PostCategory $category): int
    {
        /** @var int $key */
        $key = $category->getKey();

        return $key;
    }

    private function resolvePostKey(Post $post): int
    {
        /** @var int $key */
        $key = $post->getKey();

        return $key;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function resolveArchiveTemplateData(PostCategory $category): ?array
    {
        $templateData = $category->getAttributeValue('archive_template_data');

        if (! is_array($templateData)) {
            return null;
        }

        /** @var array<string, mixed> $templateData */
        return $templateData;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function resolvePostTemplateData(Post $post): ?array
    {
        $templateData = $post->getAttributeValue('template_data');

        if (! is_array($templateData)) {
            return null;
        }

        /** @var array<string, mixed> $templateData */
        return $templateData;
    }
}
