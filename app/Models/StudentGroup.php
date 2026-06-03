<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\StudentGroupFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class StudentGroup extends Model
{
    /** @use HasFactory<StudentGroupFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'code',
        'owner_id',
    ];

    /** @return BelongsTo<User, $this> */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /** @return HasMany<StudentGroupMember, $this> */
    public function members(): HasMany
    {
        return $this->hasMany(StudentGroupMember::class);
    }

    /** @return MorphToMany<Page, $this> */
    public function pages(): MorphToMany
    {
        return $this->morphedByMany(Page::class, 'accessible', 'content_student_group_access');
    }

    /** @return MorphToMany<Post, $this> */
    public function posts(): MorphToMany
    {
        return $this->morphedByMany(Post::class, 'accessible', 'content_student_group_access');
    }

    /**
     * @template TModel of StudentGroup
     *
     * @param  Builder<TModel>  $query
     * @return Builder<TModel>
     */
    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        return $query->where(function (Builder $visibilityQuery) use ($user): void {
            $visibilityQuery
                ->whereNull('owner_id')
                ->orWhere('owner_id', $user->id);
        });
    }

    public function isGlobal(): bool
    {
        return $this->owner_id === null;
    }

    public function isOwnedBy(User $user): bool
    {
        return $this->owner_id === $user->id;
    }
}
