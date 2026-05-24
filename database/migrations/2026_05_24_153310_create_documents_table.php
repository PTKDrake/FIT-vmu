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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('description')->nullable();
            $table->string('description_format', 50)->default('blocknote_json');
            $table->foreignId('file_id')
                ->nullable()
                ->constrained('media')
                ->nullOnDelete();
            $table->foreignId('owner_id')
                ->constrained('users')
                ->restrictOnDelete();
            $table->string('document_type')->index();
            $table->string('visibility')->default('private')->index();
            $table->string('status')->default('draft')->index();
            $table->string('document_mode')->default('file')->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->timestamps();

            $table->index(['owner_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
