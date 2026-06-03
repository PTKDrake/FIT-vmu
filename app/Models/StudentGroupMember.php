<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\StudentGroupMemberFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentGroupMember extends Model
{
    /** @use HasFactory<StudentGroupMemberFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'student_group_id',
        'student_code',
    ];

    /** @return BelongsTo<StudentGroup, $this> */
    public function studentGroup(): BelongsTo
    {
        return $this->belongsTo(StudentGroup::class);
    }
}
