<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Student;
use Illuminate\Support\Carbon;

class StudentData extends Data
{
    public function __construct(
        public int $userId,
        public string $studentCode,
        public string $className,
        public string $major,
        public ?Carbon $createdAt = null,
        public ?Carbon $updatedAt = null,
        public ?int $id = null,
    ) {}

    public static function fromModel(Student $student): self
    {
        return new self(
            userId: $student->user_id,
            studentCode: $student->student_code,
            className: $student->class_name,
            major: $student->major,
            createdAt: $student->created_at,
            updatedAt: $student->updated_at,
            id: $student->id,
        );
    }
}
