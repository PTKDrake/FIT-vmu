<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\PHPStan\Rules\NoRequestInputGetRule;
use PHPStan\Rules\Rule;
use PHPStan\Testing\RuleTestCase;

/**
 * @extends RuleTestCase<NoRequestInputGetRule>
 */
final class NoRequestInputGetRuleTest extends RuleTestCase
{
    public function test_it_reports_request_input_and_get_usage(): void
    {
        $this->analyse(
            [__DIR__.'/fixtures/NoRequestInputGetRule/BadRequestInputGetUsage.php'],
            [
                [
                    'Do not use Request::input(). Use type-safe request accessors like string(), integer(), boolean(), array(), date(), enum(), or validated() instead.',
                    14,
                ],
                [
                    'Do not use Request::get(). Use type-safe request accessors like string(), integer(), boolean(), array(), date(), enum(), or validated() instead.',
                    15,
                ],
                [
                    'Do not use Request::input(). Use type-safe request accessors like string(), integer(), boolean(), array(), date(), enum(), or validated() instead.',
                    25,
                ],
                [
                    'Do not use Request::get(). Use type-safe request accessors like string(), integer(), boolean(), array(), date(), enum(), or validated() instead.',
                    26,
                ],
            ],
        );
    }

    public function test_it_allows_typed_request_accessors_and_non_request_getters(): void
    {
        $this->analyse(
            [__DIR__.'/fixtures/NoRequestInputGetRule/GoodRequestInputGetUsage.php'],
            [],
        );
    }

    protected function getRule(): Rule
    {
        return new NoRequestInputGetRule;
    }
}
