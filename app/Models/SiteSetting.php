<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SiteSetting extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'homepage_page_id',
        'not_found_page_id',
        'student_home_page_id',
    ];

    public static function current(): self
    {
        /** @var self $settings */
        $settings = self::query()->firstOrCreate(['id' => 1]);

        return $settings;
    }

    /** @return BelongsTo<Page, $this> */
    public function homepagePage(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'homepage_page_id');
    }

    /** @return BelongsTo<Page, $this> */
    public function notFoundPage(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'not_found_page_id');
    }

    /** @return BelongsTo<Page, $this> */
    public function studentHomePage(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'student_home_page_id');
    }
}
