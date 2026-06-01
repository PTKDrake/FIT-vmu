<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->string('template_key')->default('default')->after('published_at');
            $table->json('template_data')->nullable()->after('template_key');
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->string('template_key')->default('article')->after('published_at');
            $table->json('template_data')->nullable()->after('template_key');
        });

        Schema::table('post_categories', function (Blueprint $table) {
            $table->string('display_mode')->default('archive')->after('is_active');
            $table->string('archive_template_key')->nullable()->after('display_mode');
            $table->json('archive_template_data')->nullable()->after('archive_template_key');
            $table->string('post_template_key')->nullable()->after('archive_template_data');
            $table->json('post_template_data')->nullable()->after('post_template_key');
        });
    }

    public function down(): void
    {
        Schema::table('post_categories', function (Blueprint $table) {
            $table->dropColumn([
                'display_mode',
                'archive_template_key',
                'archive_template_data',
                'post_template_key',
                'post_template_data',
            ]);
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn([
                'template_key',
                'template_data',
            ]);
        });

        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn([
                'template_key',
                'template_data',
            ]);
        });
    }
};
