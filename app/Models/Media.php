<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\MediaFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    /** @use HasFactory<MediaFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'disk',
        'path',
        'original_name',
        'display_name',
        'mime_type',
        'size',
        'uploaded_by',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'size' => 'integer',
        ];
    }

    /** @return Attribute<string, never> */
    protected function previewUrl(): Attribute
    {
        return Attribute::get(fn (): string => Storage::disk($this->disk)->url($this->path));
    }

    /** @return BelongsTo<User, $this> */
    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /** @return HasMany<StaffProfile, $this> */
    public function avatarStaffProfiles(): HasMany
    {
        return $this->hasMany(StaffProfile::class, 'avatar_id');
    }

    /** @return HasMany<Post, $this> */
    public function postThumbnails(): HasMany
    {
        return $this->hasMany(Post::class, 'thumbnail_id');
    }

    /** @return HasMany<Page, $this> */
    public function pageThumbnails(): HasMany
    {
        return $this->hasMany(Page::class, 'thumbnail_id');
    }
}
