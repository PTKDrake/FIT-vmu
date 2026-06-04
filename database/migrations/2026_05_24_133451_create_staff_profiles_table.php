<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('staff_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();
            $table->string('academic_title')->nullable();
            $table->string('full_name');
            $table->string('slug')->unique();
            $table->unsignedBigInteger('avatar_id')->nullable()->index();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->longText('bio')->nullable();
            $table->string('bio_format', 50)->default('blocknote_json');
            $table->boolean('is_public')->default(false)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff_profiles');
    }
};
