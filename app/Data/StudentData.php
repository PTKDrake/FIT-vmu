<?php

declare(strict_types=1);

namespace App\Data;

use App\Models\Student;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;

class StudentData extends Data
{
    public function __construct(
        public ?int $id,
        public ?int $userId,
        public string $studentCode,
        public ?string $className,
        public ?string $major,
        public ?CarbonImmutable $createdAt,
        public ?CarbonImmutable $updatedAt,
    ) {}

    public static function fromModel(Student $student): self
    {
        return new self(
            id: $student->id,
            userId: $student->user_id,
            studentCode: $student->student_code,
            className: $student->class_name,
            major: $student->major,
            createdAt: $student->created_at?->toImmutable(),
            updatedAt: $student->updated_at?->toImmutable(),
        );
    }
}
