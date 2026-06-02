<?php

declare(strict_types=1);

namespace App\Actions\Puck;

use App\Models\Document;
use App\Models\NavigationItem;
use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\StaffProfile;
use App\Models\Unit;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\Storage;

class BuildPuckDynamicDataAction
{
    /**
     * @return array{
     *     navigationMenus: list<array{id: int, name: string, slug: string, location: ?string, items: list<array<string, mixed>>}>,
     *     posts: list<array{id: int, title: string, slug: string, excerpt: ?string, date: ?string, author: ?string, categoryIds: list<int>, categoryNames: list<string>}>,
     *     categories: list<array{id: int, name: string, slug: string, parentId: ?int, description: ?string}>,
     *     staff: list<array{id: int, name: string, slug: string, email: ?string, phone: ?string, avatarUrl: ?string, position: ?string, unitIds: list<int>, expertise: ?string}>,
     *     units: list<array{id: int, name: string, slug: string, description: ?string, head: ?string}>,
     *     documents: list<array{id: int, title: string, slug: string, type: string, size: ?string, date: ?string, url: ?string}>,
     *     pages: list<array{id: int, title: string, slug: string, url: string}>
     * }
     */
    public function __invoke(): array
    {
        return [
            'navigationMenus' => $this->navigationMenus(),
            'posts' => $this->posts(),
            'categories' => $this->categories(),
            'staff' => $this->staff(),
            'units' => $this->units(),
            'documents' => $this->documents(),
            'pages' => $this->pages(),
        ];
    }

    /** @return list<array{id: int, name: string, slug: string, location: ?string, items: list<array<string, mixed>>}> */
    private function navigationMenus(): array
    {
        return array_values(NavigationMenu::query()
            ->where('is_active', true)
            ->with('items')
            ->orderBy('location')
            ->orderBy('name')
            ->get()
            ->map(fn (NavigationMenu $menu): array => [
                'id' => $menu->id,
                'name' => $menu->name,
                'slug' => $menu->slug,
                'location' => $menu->location,
                'items' => $this->buildNavigationTree(array_values($menu->items->where('is_active', true)->all())),
            ])
            ->all());
    }

    /**
     * @param  list<NavigationItem>  $items
     * @return list<array<string, mixed>>
     */
    private function buildNavigationTree(array $items, ?int $parentId = null): array
    {
        return array_values(collect($items)
            ->filter(fn (NavigationItem $item): bool => $item->parent_id === $parentId)
            ->map(fn (NavigationItem $item): array => [
                'id' => $item->id,
                'title' => $item->title,
                'url' => $this->navigationItemUrl($item),
                'target' => $item->target,
                'children' => $this->buildNavigationTree($items, $item->id),
            ])
            ->all());
    }

    private function navigationItemUrl(NavigationItem $item): string
    {
        if ($item->url) {
            return $item->url;
        }

        if ($item->linkable_type === Page::class && $item->linkable_id) {
            $page = Page::query()->find($item->linkable_id);

            return $page instanceof Page ? '/'.$page->slug : '#';
        }

        if ($item->linkable_type === Post::class && $item->linkable_id) {
            $post = Post::query()->find($item->linkable_id);

            return $post instanceof Post ? '/posts/'.$post->slug : '#';
        }

        if ($item->linkable_type === PostCategory::class && $item->linkable_id) {
            $category = PostCategory::query()->find($item->linkable_id);

            return $category instanceof PostCategory ? '/post-categories/'.$category->slug : '#';
        }

        return '#';
    }

    /** @return list<array{id: int, title: string, slug: string, excerpt: ?string, date: ?string, author: ?string, categoryIds: list<int>, categoryNames: list<string>}> */
    private function posts(): array
    {
        return array_values(Post::query()
            ->where('status', 'published')
            ->with(['author', 'categories'])
            ->latest('published_at')
            ->latest()
            ->limit(30)
            ->get()
            ->map(function (Post $post): array {
                $categoryIds = array_values(
                    $post->categories
                        ->map(static fn (PostCategory $category): int => $category->id)
                        ->all(),
                );

                $categoryNames = array_values(
                    $post->categories
                        ->map(static fn (PostCategory $category): string => $category->name)
                        ->filter(static fn (string $name): bool => $name !== '')
                        ->all(),
                );

                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'date' => $this->formatDate($post->published_at),
                    'author' => $post->author?->name,
                    'categoryIds' => $categoryIds,
                    'categoryNames' => $categoryNames,
                ];
            })
            ->all());
    }

    /** @return list<array{id: int, name: string, slug: string, parentId: ?int, description: ?string}> */
    private function categories(): array
    {
        return array_values(PostCategory::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (PostCategory $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'parentId' => $category->parent_id,
                'description' => $category->description,
            ])
            ->all());
    }

    /** @return list<array{id: int, name: string, slug: string, email: ?string, phone: ?string, avatarUrl: ?string, position: ?string, unitIds: list<int>, expertise: ?string}> */
    private function staff(): array
    {
        return array_values(StaffProfile::query()
            ->where('is_public', true)
            ->with(['avatar', 'appointments.position', 'appointments.unit'])
            ->orderBy('full_name')
            ->limit(30)
            ->get()
            ->map(function (StaffProfile $staffProfile): array {
                $primaryAppointment = $staffProfile->appointments->first();
                $unitIds = array_values(
                    $staffProfile->appointments
                        ->map(static fn ($appointment): int => $appointment->unit_id)
                        ->all(),
                );

                return [
                    'id' => $staffProfile->id,
                    'name' => $staffProfile->full_name,
                    'slug' => $staffProfile->slug,
                    'email' => $staffProfile->email,
                    'phone' => $staffProfile->phone,
                    'avatarUrl' => $staffProfile->avatar ? Storage::disk($staffProfile->avatar->disk)->url($staffProfile->avatar->path) : null,
                    'position' => $primaryAppointment?->position?->name,
                    'unitIds' => $unitIds,
                    'expertise' => $primaryAppointment?->unit?->name,
                ];
            })
            ->all());
    }

    /** @return list<array{id: int, name: string, slug: string, description: ?string, head: ?string}> */
    private function units(): array
    {
        return array_values(Unit::query()
            ->where('is_active', true)
            ->with(['staffAppointments.staffProfile', 'staffAppointments.position'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (Unit $unit): array => [
                'id' => $unit->id,
                'name' => $unit->name,
                'slug' => $unit->slug,
                'description' => $this->plainTextFromBlocknote($unit->description),
                'head' => $unit->staffAppointments->first()?->staffProfile?->full_name,
            ])
            ->all());
    }

    /** @return list<array{id: int, title: string, slug: string, type: string, size: ?string, date: ?string, url: ?string}> */
    private function documents(): array
    {
        return array_values(Document::query()
            ->where('status', 'published')
            ->where('visibility', 'public')
            ->with('file')
            ->latest('published_at')
            ->latest()
            ->limit(30)
            ->get()
            ->map(fn (Document $document): array => [
                'id' => $document->id,
                'title' => $document->title,
                'slug' => $document->slug,
                'type' => $document->document_type,
                'size' => $document->file ? $this->formatBytes($document->file->size) : null,
                'date' => $this->formatDate($document->published_at),
                'url' => $document->file ? Storage::disk($document->file->disk)->url($document->file->path) : null,
            ])
            ->all());
    }

    /** @return list<array{id: int, title: string, slug: string, url: string}> */
    private function pages(): array
    {
        return array_values(Page::query()
            ->where('status', 'published')
            ->orderBy('title')
            ->limit(50)
            ->get(['id', 'title', 'slug'])
            ->map(fn (Page $page): array => [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'url' => '/'.$page->slug,
            ])
            ->all());
    }

    private function formatDate(mixed $value): ?string
    {
        if ($value instanceof CarbonInterface) {
            return $value->format('d/m/Y');
        }

        return null;
    }

    private function plainTextFromBlocknote(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        try {
            $blocks = json_decode($value, true, flags: JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return null;
        }

        if (! is_array($blocks)) {
            return null;
        }

        $text = collect($blocks)
            ->flatMap(fn (mixed $block): array => is_array($block) && isset($block['content']) && is_array($block['content']) ? $block['content'] : [])
            ->pluck('text')
            ->filter()
            ->implode(' ');

        return $text !== '' ? str($text)->limit(180)->toString() : null;
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1_048_576) {
            return round($bytes / 1_048_576, 1).' MB';
        }

        return round($bytes / 1024, 1).' KB';
    }
}
