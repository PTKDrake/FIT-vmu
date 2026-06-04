<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('post_categories', function (Blueprint $table): void {
            $table->foreignId('site_layout_id')
                ->nullable()
                ->after('is_active')
                ->constrained('site_layouts')
                ->nullOnDelete();
        });

        Schema::table('posts', function (Blueprint $table): void {
            $table->foreignId('site_layout_id')
                ->nullable()
                ->after('content_format')
                ->constrained('site_layouts')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('post_categories', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('site_layout_id');
        });

        Schema::table('posts', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('site_layout_id');
        });
    }
};
