<?php

test('foreign key migrations are ordered before dependent tables', function () {
    $migrationFiles = collect(glob(database_path('migrations/*.php')))
        ->map(fn (string $path): string => basename($path))
        ->sort()
        ->values();

    $navigationMenusIndex = $migrationFiles->search('2026_05_25_175256_create_navigation_menus_table.php');
    $navigationItemsIndex = $migrationFiles->search('2026_05_25_175257_create_navigation_items_table.php');

    expect($navigationMenusIndex)->not->toBeFalse()
        ->and($navigationItemsIndex)->not->toBeFalse()
        ->and($navigationMenusIndex)->toBeLessThan($navigationItemsIndex);
});
