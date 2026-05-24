<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\PHPStan\Rules\NoPipeStringInRequestRulesRule;
use PHPStan\DependencyInjection\MissingServiceException;
use PHPStan\Reflection\ReflectionProvider;
use PHPStan\Rules\Rule;
use PHPStan\Testing\RuleTestCase;

/**
 * @extends RuleTestCase<NoPipeStringInRequestRulesRule>
 */
final class NoPipeStringInRequestRulesRuleTest extends RuleTestCase
{
    public function test_it_reports_pipe_delimited_rule_strings_in_form_requests(): void
    {
        $this->analyse(
            [__DIR__.'/fixtures/NoPipeStringInRequestRulesRule/BadRequestRules.php'],
            [
                [
                    'FormRequest rules must use array syntax. Do not use pipe-delimited rule strings.',
                    15,
                ],
                [
                    'FormRequest rules must use array syntax. Do not use pipe-delimited rule strings.',
                    19,
                ],
            ],
        );
    }

    public function test_it_allows_array_syntax_in_form_requests(): void
    {
        $this->analyse(
            [__DIR__.'/fixtures/NoPipeStringInRequestRulesRule/GoodRequestRules.php'],
            [],
        );
    }

    /**
     * @throws MissingServiceException
     */
    protected function getRule(): Rule
    {
        return new NoPipeStringInRequestRulesRule(
            self::getContainer()->getByType(ReflectionProvider::class),
        );
    }
}
