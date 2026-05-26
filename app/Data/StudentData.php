<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Student;
use Carbon\CarbonInterface;

class StudentData extends Data
{
    public function __construct(
        public int $userId,
        public string $studentCode,
        public ?string $className,
        public ?string $major,
        public ?CarbonInterface $createdAt = null,
        public ?CarbonInterface $updatedAt = null,
        public ?int $id = null,
    ) {}

    public static function fromModel(Student $student): self
    {
        return new self(
            userId: $student->user_id,
            studentCode: $student->student_code,
            className: $student->class_name,
            major: $student->major,
            createdAt: self::normalizeDateTime($student->created_at),
            updatedAt: self::normalizeDateTime($student->updated_at),
            id: $student->id,
        );
    }
}
