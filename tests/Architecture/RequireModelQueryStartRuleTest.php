<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\PHPStan\Rules\RequireModelQueryStartRule;
use PHPStan\DependencyInjection\MissingServiceException;
use PHPStan\Reflection\ReflectionProvider;
use PHPStan\Rules\Rule;
use PHPStan\Testing\RuleTestCase;

/**
 * @extends RuleTestCase<RequireModelQueryStartRule>
 */
final class RequireModelQueryStartRuleTest extends RuleTestCase
{
    public function test_it_reports_static_model_calls_that_skip_query_start(): void
    {
        $this->analyse(
            [__DIR__.'/fixtures/RequireModelQueryStartRule/BadModelQueryUsage.php'],
            [
                [
                    'Do not call App\Models\User::find() directly. Start with App\Models\User::query() and continue from the builder.',
                    13,
                ],
                [
                    'Do not call App\Models\User::where() directly. Start with App\Models\User::query() and continue from the builder.',
                    14,
                ],
                [
                    'Do not call App\Models\User::firstOrFail() directly. Start with App\Models\User::query() and continue from the builder.',
                    15,
                ],
                [
                    'Do not call App\Models\User::all() directly. Start with App\Models\User::query() and continue from the builder.',
                    16,
                ],
                [
                    'Do not call App\Models\User::destroy() directly. Start with App\Models\User::query() and continue from the builder.',
                    17,
                ],
                [
                    'Do not call App\Models\User::create() directly. Start with App\Models\User::query() and continue from the builder.',
                    18,
                ],
                [
                    'Do not call App\Models\User::firstOrCreate() directly. Start with App\Models\User::query() and continue from the builder.',
                    19,
                ],
            ],
        );
    }

    public function test_it_allows_query_and_factory_static_usage(): void
    {
        $this->analyse(
            [__DIR__.'/fixtures/RequireModelQueryStartRule/GoodModelQueryUsage.php'],
            [],
        );
    }

    /**
     * @throws MissingServiceException
     */
    protected function getRule(): Rule
    {
        return new RequireModelQueryStartRule(
            self::getContainer()->getByType(ReflectionProvider::class),
        );
    }
}
