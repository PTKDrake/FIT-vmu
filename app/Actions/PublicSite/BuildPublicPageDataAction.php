<?php

declare(strict_types=1);

namespace App\Actions\PublicSite;

use App\Models\Page;
use Carbon\CarbonInterface;

class BuildPublicPageDataAction
{
    /**
     * @return array<string, mixed>
     */
    public function __invoke(Page $page): array
    {
        $page->loadMissing(['author', 'thumbnail']);

        return [
            'id' => $this->resolveModelKey($page),
            'title' => $page->title,
            'slug' => $page->slug,
            'content' => $page->content,
            'excerpt' => $page->excerpt,
            'publishedAt' => $this->formatDateTime($page->published_at),
            'authorName' => $page->author?->name,
            'templateKey' => $page->template_key,
            'templateData' => $this->resolveTemplateData($page),
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

    private function resolveModelKey(Page $page): int
    {
        /** @var int $key */
        $key = $page->getKey();

        return $key;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function resolveTemplateData(Page $page): ?array
    {
        $templateData = $page->getAttributeValue('template_data');

        if (! is_array($templateData)) {
            return null;
        }

        /** @var array<string, mixed> $templateData */
        return $templateData;
    }
}
