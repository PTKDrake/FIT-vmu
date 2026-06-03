<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_groups', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('code', 64)->unique();
            $table->foreignId('owner_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamps();
            $table->index('owner_id');
        });

        Schema::create('student_group_members', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('student_group_id')
                ->constrained('student_groups')
                ->cascadeOnDelete();
            $table->string('student_code', 64);
            $table->timestamps();

            $table->unique([
                'student_group_id',
                'student_code',
            ], 'student_group_members_unique');
            $table->index('student_code');
        });

        Schema::create('content_student_group_access', function (Blueprint $table): void {
            $table->id();
            $table->morphs('accessible');
            $table->foreignId('student_group_id')
                ->constrained('student_groups')
                ->cascadeOnDelete();
            $table->timestamps();

            $table->unique([
                'accessible_type',
                'accessible_id',
                'student_group_id',
            ], 'content_student_group_access_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_student_group_access');
        Schema::dropIfExists('student_group_members');
        Schema::dropIfExists('student_groups');
    }
};
