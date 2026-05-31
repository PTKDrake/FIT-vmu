<?php

use App\Models\Media;
use App\Models\User;
use Database\Seeders\MediaSeeder;
use Illuminate\Support\Facades\Storage;

test('media seeder copies 30 source files into the public disk without creating duplicates', function () {
    Storage::fake('public');

    $uploader = User::factory()->create([
        'email' => 'admin@vimaru.edu.vn',
        'name' => 'Trình tạo quản trị',
    ]);

    $this->seed(MediaSeeder::class);
    $this->seed(MediaSeeder::class);

    $media = Media::query()
        ->orderBy('path')
        ->get();

    expect($media)->toHaveCount(30)
        ->and($media->pluck('path')->unique())->toHaveCount(30)
        ->and($media->every(fn (Media $item): bool => $item->uploaded_by === $uploader->getKey()))->toBeTrue();

    $media->each(function (Media $item): void {
        Storage::disk('public')->assertExists($item->path);

        expect($item->path)->toStartWith('media/seed/')
            ->and($item->original_name)->toBe(basename($item->path))
            ->and($item->display_name)->not->toBe('')
            ->and($item->mime_type)->toStartWith('image/')
            ->and($item->size)->toBeGreaterThan(0);
    });
});
