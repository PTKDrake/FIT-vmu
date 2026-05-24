<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\PHPStan\Rules\NoFactoryCreateRule;
use PHPStan\Rules\Rule;
use PHPStan\Testing\RuleTestCase;

/**
 * @extends RuleTestCase<NoFactoryCreateRule>
 */
final class NoFactoryCreateRuleTest extends RuleTestCase
{
    public function test_it_reports_factory_create_usage(): void
    {
        $this->analyse(
            [__DIR__.'/fixtures/NoFactoryCreateRule/BadFactoryCreateUsage.php'],
            [
                [
                    'Do not call Factory::create(). Use createOne() for a single model or createMany() for multiple models.',
                    7,
                ],
                [
                    'Do not call Factory::create(). Use createOne() for a single model or createMany() for multiple models.',
                    10,
                ],
            ],
        );
    }

    public function test_it_allows_create_one_and_create_many(): void
    {
        $this->analyse(
            [__DIR__.'/fixtures/NoFactoryCreateRule/GoodFactoryCreateUsage.php'],
            [],
        );
    }

    protected function getRule(): Rule
    {
        return new NoFactoryCreateRule;
    }
}
