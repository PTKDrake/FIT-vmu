<?php

declare(strict_types=1);

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;

    use HasRoles;
    use Notifiable;

    protected string $guard_name = 'web';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /** @return Attribute<string, never> */
    public function gravatar(): Attribute
    {
        return Attribute::make(fn () => $this->avatar());
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected function avatar(int $size = 200): string
    {
        return 'https://www.gravatar.com/avatar/'.md5(strtolower(trim($this->email))).'?s='.$size.'&d=mp';
    }

    /** @return HasOne<Student, $this> */
    public function student(): HasOne
    {
        return $this->hasOne(Student::class);
    }

    /** @return HasOne<StaffProfile, $this> */
    public function staffProfile(): HasOne
    {
        return $this->hasOne(StaffProfile::class);
    }

    /** @return HasMany<Post, $this> */
    public function authoredPosts(): HasMany
    {
        return $this->hasMany(Post::class, 'author_id');
    }

    /** @return HasMany<Page, $this> */
    public function authoredPages(): HasMany
    {
        return $this->hasMany(Page::class, 'author_id');
    }

    /** @return HasMany<StudentGroup, $this> */
    public function ownedStudentGroups(): HasMany
    {
        return $this->hasMany(StudentGroup::class, 'owner_id');
    }

    /** @return HasMany<Media, $this> */
    public function uploadedMedia(): HasMany
    {
        return $this->hasMany(Media::class, 'uploaded_by');
    }
}
