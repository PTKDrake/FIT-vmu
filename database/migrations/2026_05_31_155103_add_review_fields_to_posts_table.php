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
        Schema::table('posts', function (Blueprint $table) {
            $table->foreignId('reviewed_by_id')
                ->nullable()
                ->after('author_id')
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('reviewed_at')
                ->nullable()
                ->after('published_at')
                ->index();
            $table->text('rejection_reason')
                ->nullable()
                ->after('reviewed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropConstrainedForeignId('reviewed_by_id');
            $table->dropIndex('posts_reviewed_at_index');
            $table->dropColumn([
                'reviewed_at',
                'rejection_reason',
            ]);
        });
    }
};
