<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Media;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\Finder\SplFileInfo;

class MediaSeeder extends Seeder
{
    private const MAX_MEDIA_ITEMS = 30;

    /** @var list<string> */
    private const SUPPORTED_EXTENSIONS = [
        'bmp',
        'gif',
        'ico',
        'pbm',
        'png',
        'webp',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $uploader = $this->resolveUploader();
        $seedFiles = $this->seedFiles();

        foreach ($seedFiles as $index => $seedFile) {
            $path = $this->buildStoragePath($seedFile, $index);
            $absolutePath = $seedFile->getRealPath();

            if ($absolutePath === false) {
                continue;
            }

            Storage::disk('public')->put($path, File::get($absolutePath));

            Media::query()->updateOrCreate(
                ['path' => $path],
                [
                    'disk' => 'public',
                    'original_name' => basename($path),
                    'display_name' => $seedFile->getFilename(),
                    'mime_type' => File::mimeType($absolutePath) ?: 'application/octet-stream',
                    'size' => $seedFile->getSize(),
                    'uploaded_by' => $uploader->getKey(),
                ],
            );
        }
    }

    private function resolveUploader(): User
    {
        $existingUploader = User::query()
            ->whereIn('email', ['admin@vimaru.edu.vn', 'super-admin@vimaru.edu.vn'])
            ->first();

        if ($existingUploader instanceof User) {
            return $existingUploader;
        }

        $firstUser = User::query()->first();

        if ($firstUser instanceof User) {
            return $firstUser;
        }

        /** @var User $user */
        $user = User::query()->updateOrCreate(
            ['email' => 'media-seeder@vimaru.edu.vn'],
            [
                'name' => 'Trình tạo media',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
            ],
        );

        return $user;
    }

    /**
     * @return list<SplFileInfo>
     */
    private function seedFiles(): array
    {
        $files = collect(File::allFiles(storage_path('seed/media-seed')))
            ->filter(function (SplFileInfo $file): bool {
                return in_array(strtolower($file->getExtension()), self::SUPPORTED_EXTENSIONS, true);
            })
            ->sortBy(function (SplFileInfo $file): string {
                return str_replace('\\', '/', $file->getRelativePathname());
            })
            ->take(self::MAX_MEDIA_ITEMS)
            ->values()
            ->all();

        /** @var list<SplFileInfo> $files */
        return $files;
    }

    private function buildStoragePath(SplFileInfo $seedFile, int $index): string
    {
        $seedNumber = str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT);
        $extension = strtolower($seedFile->getExtension());
        $baseName = Str::slug(pathinfo($seedFile->getFilename(), PATHINFO_FILENAME));
        $storageName = "seed-{$seedNumber}-{$baseName}";

        if ($extension !== '') {
            $storageName .= ".{$extension}";
        }

        return "media/seed/{$storageName}";
    }
}
