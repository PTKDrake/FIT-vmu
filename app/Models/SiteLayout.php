<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\SiteLayoutFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SiteLayout extends Model
{
    /** @use HasFactory<SiteLayoutFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'name',
        'key',
        'header_data',
        'footer_data',
        'left_data',
        'right_data',
    ];

    /** @return HasMany<Page, $this> */
    public function pages(): HasMany
    {
        return $this->hasMany(Page::class);
    }

    /** @return HasMany<PostCategory, $this> */
    public function postCategories(): HasMany
    {
        return $this->hasMany(PostCategory::class);
    }

    /** @return HasMany<Post, $this> */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
