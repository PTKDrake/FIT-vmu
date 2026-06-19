<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Concerns\HasSearchText;
use Database\Factories\NavigationMenuFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NavigationMenu extends Model
{
    /** @use HasFactory<NavigationMenuFactory> */
    use HasFactory;

    use HasSearchText;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'location',
        'is_active',
    ];

    /**
     * The default values for attributes.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'is_active' => true,
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /** @return list<string> */
    protected function searchableTextColumns(): array
    {
        return ['name', 'slug', 'location'];
    }

    /** @return HasMany<NavigationItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(NavigationItem::class, 'menu_id')
            ->orderBy('sort_order')
            ->orderBy('id');
    }
}
