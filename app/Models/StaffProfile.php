<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\StaffProfileFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StaffProfile extends Model
{
    /** @use HasFactory<StaffProfileFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'academic_title',
        'full_name',
        'slug',
        'avatar_id',
        'email',
        'phone',
        'bio',
        'bio_format',
        'is_public',
    ];

    /**
     * The default values for attributes.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'bio_format' => 'blocknote_json',
        'is_public' => false,
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Media, $this> */
    public function avatar(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'avatar_id');
    }

    /** @return HasMany<StaffAppointment, $this> */
    public function appointments(): HasMany
    {
        return $this->hasMany(StaffAppointment::class);
    }

    public function displayName(): string
    {
        $academicTitle = trim((string) $this->academic_title);

        if ($academicTitle === '') {
            return $this->full_name;
        }

        if (str_starts_with(mb_strtolower($this->full_name), mb_strtolower($academicTitle))) {
            return $this->full_name;
        }

        return sprintf('%s %s', $academicTitle, $this->full_name);
    }
}
