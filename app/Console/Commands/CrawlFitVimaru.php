<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class CrawlFitVimaru extends Command
{
    protected $signature = 'fit:crawl-vimaru {--only=} {--limit=} {--output=} {--refresh : force re-download HTML files to cache} {--offline : only use cached HTML, never hit network}';

    protected $description = 'Crawl fit.vimaru.edu.vn/vi and export a PHP data file used by DonViAndChuyenNganhSeeder. HTML is cached to storage/crawl/fit-vimaru/ for offline re-parsing.';

    private const BASE_URL = 'https://fit.vimaru.edu.vn';

    private const CACHE_DIR = 'crawl/fit-vimaru';

    /** @var list<array{slug: string, path: string, name: string}> */
    private const UNITS = [
        ['slug' => 'ban-chu-nhiem-khoa', 'path' => '/vi/don-vi/ban-chu-nhiem-khoa', 'name' => 'Ban chủ nhiệm khoa'],
        ['slug' => 'bo-mon-he-thong-thong-tin', 'path' => '/vi/don-vi/bo-mon-he-thong-thong-tin', 'name' => 'Bộ môn Hệ thống thông tin'],
        ['slug' => 'bo-mon-khoa-hoc-may-tinh', 'path' => '/vi/don-vi/bo-mon-khoa-hoc-may-tinh', 'name' => 'Bộ môn Khoa học máy tính'],
        ['slug' => 'bo-mon-ky-thuat-may-tinh', 'path' => '/vi/don-vi/bo-mon-ky-thuat-may-tinh', 'name' => 'Bộ môn Kỹ thuật máy tính'],
        ['slug' => 'bo-mon-tin-hoc-dai-cuong', 'path' => '/vi/don-vi/bo-mon-tin-hoc-dai-cuong', 'name' => 'Bộ môn Tin học đại cương'],
        ['slug' => 'bo-mon-truyen-thong-va-mang-may-tinh', 'path' => '/vi/don-vi/bo-mon-truyen-thong-va-mang-may-tinh', 'name' => 'Bộ môn Truyền thông và Mạng máy tính'],
        ['slug' => 'ban-chap-hanh-cong-doan', 'path' => '/vi/don-vi/ban-chap-hanh-cong-doan', 'name' => 'Ban chấp hành Công đoàn'],
        ['slug' => 'lien-chi-doan-khoa-cong-nghe-thong-tin', 'path' => '/vi/tin/lien-chi-doan-khoa-cong-nghe-thong-tin', 'name' => 'Liên chi đoàn Khoa CNTT'],
    ];

    /** @var list<array{slug: string, path: string, name: string}> */
    private const MAJORS = [
        ['slug' => 'cong-nghe-thong-tin', 'path' => '/vi/chuyen-nganh-cong-nghe-thong-tin', 'name' => 'Chuyên ngành Công nghệ thông tin'],
        ['slug' => 'cong-nghe-phan-mem', 'path' => '/vi/chuyen-nganh/cong-nghe-phan-mem', 'name' => 'Chuyên ngành Công nghệ phần mềm'],
        ['slug' => 'truyen-thong-va-mang-may-tinh', 'path' => '/vi/chuyen-nganh-truyen-thong-va-mang-may-tinh', 'name' => 'Chuyên ngành Truyền thông và mạng máy tính'],
    ];

    /** @var list<array{slug: string, path: string}> */
    private const LISTINGS = [
        ['slug' => 'thong-bao', 'path' => '/vi/tin/thong-bao'],
        ['slug' => 'tin-don-vi', 'path' => '/vi/tin/tin-don-vi'],
        ['slug' => 'tuyen-sinh', 'path' => '/vi/tin/tuyen-sinh'],
        ['slug' => 'tuyen-dung', 'path' => '/vi/tin/tuyen-dung'],
        ['slug' => 'ket-noi-doanh-nghiep', 'path' => '/vi/tin/ket-noi-doanh-nghiep'],
        ['slug' => 'cao-hoc', 'path' => '/vi/tin/cao-hoc'],
        ['slug' => 'thoi-khoa-bieu', 'path' => '/vi/tin/thoi-khoa-bieu'],
        ['slug' => 'doan-thanh-nien', 'path' => '/vi/tin/doan-thanh-nien'],
        ['slug' => 'cau-lac-bo-tin-hoc', 'path' => '/vi/tin/cau-lac-bo-tin-hoc-0'],
        ['slug' => 'cau-lac-bo-nghien-cuu-khoa-hoc', 'path' => '/vi/tin/cau-lac-bo-nghien-cuu-khoa-hoc'],
        ['slug' => 'hoat-dong-the-thao-van-nghe', 'path' => '/vi/tin/hoat-dong-thao-van-nghe-0'],
        ['slug' => 'hoc-bong', 'path' => '/vi/tin/hoc-bong'],
        ['slug' => 'co-hoi-viec-lam', 'path' => '/vi/tin/co-hoi-viec-lam'],
        ['slug' => 'cuu-sinh-vien', 'path' => '/vi/tin/cuu-sinh-vien'],
        ['slug' => 'hoat-dong-cong-dong', 'path' => '/vi/tin/hoat-dong-cong-dong'],
    ];

    public function handle(): int
    {
        $only = $this->option('only');
        $only = is_string($only) && $only !== '' ? $only : null;
        $limitOption = $this->option('limit');
        $limit = is_string($limitOption) && $limitOption !== '' ? (int) $limitOption : 3;
        $outputOption = $this->option('output');
        $outputPath = base_path(is_string($outputOption) && $outputOption !== '' ? $outputOption : 'database/seeders/data/fit_vimaru_crawled.php');

        $this->info('Crawling fit.vimaru.edu.vn...');

        $units = $only === null || $only === 'don-vi' ? $this->crawlUnits() : [];
        $majors = $only === null || $only === 'chuyen-nganh' ? $this->crawlMajors() : [];
        $posts = $only === null || $only === 'posts' ? $this->crawlListingPosts($limit) : [];

        $payload = [
            'generated_at' => now()->toIso8601String(),
            'units' => $units,
            'majors' => $majors,
            'posts_by_category_slug' => $posts,
        ];

        File::ensureDirectoryExists(dirname($outputPath));
        File::put($outputPath, $this->renderPhpArray($payload));

        $this->info(sprintf('Wrote %s (%d units, %d majors, %d category listings).', $outputPath, count($units), count($majors), count($posts)));

        return self::SUCCESS;
    }

    /** @return list<array{slug: string, name: string, title: string, html: string}> */
    private function crawlUnits(): array
    {
        $result = [];

        foreach (self::UNITS as $unit) {
            $html = $this->fetch($unit['path']);
            if ($html === null) {
                $this->warn('Skip unit '.$unit['path']);

                continue;
            }

            $result[] = [
                'slug' => $unit['slug'],
                'name' => $unit['name'],
                'title' => $this->extractH1($html) ?: $unit['name'],
                'html' => $this->extractBodyHtml($html),
            ];
        }

        return $result;
    }

    /** @return list<array{slug: string, name: string, title: string, html: string}> */
    private function crawlMajors(): array
    {
        $result = [];

        foreach (self::MAJORS as $major) {
            $html = $this->fetch($major['path']);
            if ($html === null) {
                $this->warn('Skip major '.$major['path']);

                continue;
            }

            $result[] = [
                'slug' => $major['slug'],
                'name' => $major['name'],
                'title' => $this->extractH1($html) ?: $major['name'],
                'html' => $this->extractBodyHtml($html),
            ];
        }

        return $result;
    }

    /** @return array<string, list<array{title: string, slug: string, excerpt: string, html: string, published_at: ?string}>> */
    private function crawlListingPosts(int $limit): array
    {
        $result = [];
        $seenSlugs = [];

        foreach (self::LISTINGS as $listing) {
            $html = $this->fetch($listing['path']);
            if ($html === null) {
                continue;
            }

            $items = $this->extractListingItems($html);
            $bucket = [];

            foreach (array_slice($items, 0, $limit) as $item) {
                if (isset($seenSlugs[$item['slug']])) {
                    continue;
                }

                $detailHtml = $this->fetch($item['path']);
                if ($detailHtml === null) {
                    continue;
                }

                $seenSlugs[$item['slug']] = true;
                $bucket[] = [
                    'title' => $this->extractTitle($detailHtml) ?: $item['title'],
                    'slug' => $item['slug'],
                    'excerpt' => $this->extractExcerpt($detailHtml),
                    'html' => $this->extractBodyHtml($detailHtml),
                    'published_at' => $item['published_at'],
                ];
            }

            if ($bucket !== []) {
                $result[$listing['slug']] = $bucket;
            }
        }

        return $result;
    }

    private function fetch(string $path): ?string
    {
        $cachePath = $this->cachePathFor($path);
        $refresh = (bool) $this->option('refresh');
        $offline = (bool) $this->option('offline');

        if (! $refresh && File::exists($cachePath)) {
            return (string) File::get($cachePath);
        }

        if ($offline) {
            $this->warn('Offline mode: skip fetch '.$path);

            return File::exists($cachePath) ? (string) File::get($cachePath) : null;
        }

        try {
            $response = Http::withoutVerifying()
                ->withUserAgent('Mozilla/5.0 (compatible; FIT-VimaruCrawler/1.0)')
                ->timeout(30)
                ->get(self::BASE_URL.$path);

            if ($response->successful()) {
                $html = (string) $response->body();
                File::ensureDirectoryExists(dirname($cachePath));
                File::put($cachePath, $html);

                return $html;
            }

            $this->warn('HTTP '.$response->status().' for '.$path);
        } catch (\Throwable $e) {
            $this->warn('Fetch failed: '.$path.' ('.$e->getMessage().')');
        }

        return File::exists($cachePath) ? (string) File::get($cachePath) : null;
    }

    private function cachePathFor(string $path): string
    {
        $relative = ltrim($path, '/');
        $relative = str_replace('/', DIRECTORY_SEPARATOR, $relative);

        return storage_path(self::CACHE_DIR.DIRECTORY_SEPARATOR.$relative.'.html');
    }

    private function extractH1(string $html): ?string
    {
        if (preg_match('/<h1[^>]*>(.*?)<\/h1>/is', $html, $m)) {
            return trim(strip_tags($m[1]));
        }

        return null;
    }

    private function extractTitle(string $html): ?string
    {
        if (preg_match('/<title>(.*?)<\/title>/is', $html, $m)) {
            $title = trim(strip_tags($m[1]));
            $title = (string) preg_replace('/\s*\|.*$/u', '', $title);

            return $title !== '' ? $title : null;
        }

        return $this->extractH1($html);
    }

    private function extractBodyHtml(string $html): string
    {
        if (preg_match('/<div[^>]*class="field-item[^"]*"[^>]*>(.*?)<\/div>\s*<\/div>\s*<\/div>/is', $html, $m)) {
            return trim($m[1]);
        }

        if (preg_match('/<div[^>]*property="content:encoded"[^>]*>(.*?)<\/div>/is', $html, $m)) {
            return trim($m[1]);
        }

        return '';
    }

    private function extractExcerpt(string $html): string
    {
        $body = $this->extractBodyHtml($html);
        $text = trim(strip_tags($body));
        $text = (string) preg_replace('/\s+/u', ' ', $text);

        return Str::limit($text, 220);
    }

    /**
     * @return list<array{title: string, slug: string, path: string, published_at: ?string}>
     */
    private function extractListingItems(string $html): array
    {
        $items = [];

        if (! preg_match_all('/<div class="event-box">(.*?)<\/div>\s*<\/div>\s*<\/div>/is', $html, $matches)) {
            return [];
        }

        foreach ($matches[1] as $block) {
            if (! preg_match('/<h4[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/is', $block, $link)) {
                continue;
            }

            $path = $link[1];
            if (! str_starts_with($path, '/vi/tin/')) {
                continue;
            }

            $slug = ltrim(substr($path, strlen('/vi/tin/')), '/');
            $title = trim(strip_tags($link[2]));

            $publishedAt = null;
            if (preg_match('/<div class="edate">\s*Tháng\s*(\d+)\s+(\d{4})\s*<\/div>/i', $block, $d)) {
                $month = (int) $d[1];
                $year = (int) $d[2];
                $publishedAt = sprintf('%04d-%02d-01 08:00:00', $year, $month);
            }

            $items[] = [
                'title' => $title,
                'slug' => $slug,
                'path' => $path,
                'published_at' => $publishedAt,
            ];
        }

        return $items;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function renderPhpArray(array $payload): string
    {
        $export = var_export($payload, true);

        $generatedAt = is_scalar($payload['generated_at']) ? (string) $payload['generated_at'] : '';

        return "<?php\n\ndeclare(strict_types=1);\n\n/**\n * Auto-generated by `php artisan fit:crawl-vimaru`.\n * Generated at: {$generatedAt}\n */\nreturn ".$export.";\n";
    }
}
