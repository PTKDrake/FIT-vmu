<?php

use App\Support\NormalizedSearch;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** @var array<string, list<string>> */
    private const SearchableTables = [
        'media' => ['display_name', 'mime_type'],
        'navigation_items' => ['title', 'url'],
        'navigation_menus' => ['name', 'slug', 'location'],
        'pages' => ['title', 'slug', 'excerpt', 'seo_title', 'seo_description'],
        'positions' => ['name', 'slug'],
        'post_categories' => ['name', 'slug', 'description'],
        'posts' => ['title', 'slug', 'excerpt'],
        'staff_profiles' => ['full_name', 'slug', 'email', 'phone', 'bio'],
        'units' => ['name', 'slug', 'description'],
        'users' => ['name', 'email'],
    ];

    public function up(): void
    {
        foreach (self::SearchableTables as $tableName => $columns) {
            Schema::table($tableName, function (Blueprint $table): void {
                $table->text('search_text')->nullable();
            });

            DB::table($tableName)
                ->select(['id', ...$columns])
                ->orderBy('id')
                ->chunkById(100, function (iterable $rows) use ($tableName, $columns): void {
                    foreach ($rows as $row) {
                        DB::table($tableName)
                            ->where('id', $row->id)
                            ->update([
                                'search_text' => NormalizedSearch::fromValues(
                                    array_map(
                                        fn (string $column): mixed => $row->{$column},
                                        $columns,
                                    ),
                                ),
                            ]);
                    }
                });
        }
    }

    public function down(): void
    {
        foreach (array_keys(self::SearchableTables) as $tableName) {
            Schema::table($tableName, function (Blueprint $table): void {
                $table->dropColumn('search_text');
            });
        }
    }
};
