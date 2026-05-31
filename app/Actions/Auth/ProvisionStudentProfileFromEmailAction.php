<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Models\Student;
use App\Models\User;

class ProvisionStudentProfileFromEmailAction
{
    public function __invoke(User $user): void
    {
        $studentCode = $this->extractStudentCode($user->email);

        if ($studentCode === null) {
            return;
        }

        if ($user->student()->exists()) {
            return;
        }

        if (Student::query()->where('student_code', $studentCode)->exists()) {
            return;
        }

        $user->student()->create([
            'student_code' => $studentCode,
        ]);
    }

    private function extractStudentCode(string $email): ?string
    {
        if (! preg_match('/^[^@]*?(?<student_code>\d+)@st\.vimaru\.edu\.vn$/i', $email, $matches)) {
            return null;
        }

        return $matches['student_code'];
    }
}
