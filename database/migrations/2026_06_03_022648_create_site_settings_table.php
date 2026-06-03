<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('homepage_page_id')
                ->nullable()
                ->constrained('pages')
                ->nullOnDelete();
            $table->foreignId('not_found_page_id')
                ->nullable()
                ->constrained('pages')
                ->nullOnDelete();
            $table->foreignId('student_home_page_id')
                ->nullable()
                ->constrained('pages')
                ->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
