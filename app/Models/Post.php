<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Concerns\HasContentVisibility;
use Database\Factories\PostFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    use HasContentVisibility;

    /** @use HasFactory<PostFactory> */
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
        'content',
        'content_format',
        'visibility',
        'thumbnail_id',
        'author_id',
        'reviewed_by_id',
        'status',
        'published_at',
        'reviewed_at',
        'rejection_reason',
    ];

    /**
     * The default values for attributes.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'content_format' => 'blocknote_json',
        'visibility' => 'public',
        'status' => 'draft',
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
            'reviewed_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Media, $this> */
    public function thumbnail(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'thumbnail_id');
    }

    /** @return BelongsToMany<PostCategory, $this> */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(PostCategory::class)
            ->withTimestamps();
    }

    /** @return BelongsTo<User, $this> */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /** @return BelongsTo<User, $this> */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by_id');
    }

    /** @return HasMany<NavigationItem, $this> */
    public function navigationItems(): HasMany
    {
        return $this->hasMany(NavigationItem::class, 'linkable_id')
            ->where('linkable_type', self::class);
    }
}
