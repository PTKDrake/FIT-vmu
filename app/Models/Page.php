<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Concerns\HasContentVisibility;
use Database\Factories\PageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Page extends Model
{
    use HasContentVisibility;

    /** @use HasFactory<PageFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'seo_title',
        'seo_description',
        'content',
        'content_format',
        'visibility',
        'site_layout_id',
        'thumbnail_id',
        'author_id',
        'published_at',
    ];

    /**
     * The default values for attributes.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'content_format' => 'puck_json',
        'visibility' => 'public',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Media, $this> */
    public function thumbnail(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'thumbnail_id');
    }

    /** @return BelongsTo<User, $this> */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /** @return BelongsTo<SiteLayout, $this> */
    public function siteLayout(): BelongsTo
    {
        return $this->belongsTo(SiteLayout::class);
    }

    /** @return HasMany<NavigationItem, $this> */
    public function navigationItems(): HasMany
    {
        return $this->hasMany(NavigationItem::class, 'linkable_id')
            ->where('linkable_type', self::class);
    }
}
