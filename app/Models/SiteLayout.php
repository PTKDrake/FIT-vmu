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
        'status',
        'is_default',
    ];

    /** @var array<string, mixed> */
    protected $attributes = [
        'status' => 'draft',
        'is_default' => false,
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
        ];
    }

    /** @return HasMany<Page, $this> */
    public function pages(): HasMany
    {
        return $this->hasMany(Page::class);
    }
}
