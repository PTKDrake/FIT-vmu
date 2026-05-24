<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\PHPStan\Rules\NoIlluminateHttpRequestImportRule;
use PHPStan\Rules\Rule;
use PHPStan\Testing\RuleTestCase;

/**
 * @extends RuleTestCase<NoIlluminateHttpRequestImportRule>
 */
final class NoIlluminateHttpRequestImportRuleTest extends RuleTestCase
{
    public function test_it_reports_illuminate_http_request_imports_in_actions(): void
    {
        $this->analyse(
            [__DIR__.'/fixtures/NoIlluminateHttpRequestImportRule/Actions/BadAction.php'],
            [
                [
                    'Do not use Illuminate\Http\Request in actions. Use an app-specific request class from App\Http\Requests instead.',
                    7,
                ],
                [
                    'Do not use Illuminate\Http\Request in actions. Use an app-specific request class from App\Http\Requests instead.',
                    8,
                ],
                [
                    'Do not use Illuminate\Http\Request in actions. Use an app-specific request class from App\Http\Requests instead.',
                    9,
                ],
            ],
        );
    }

    public function test_it_reports_illuminate_http_request_type_hints_in_actions(): void
    {
        $this->analyse(
            [__DIR__.'/fixtures/NoIlluminateHttpRequestImportRule/Actions/BadActionMethod.php'],
            [
                [
                    'Do not use Illuminate\Http\Request in actions. Use an app-specific request class from App\Http\Requests instead.',
                    7,
                ],
                [
                    'Do not use Illuminate\Http\Request in actions. Use an app-specific request class from App\Http\Requests instead.',
                    12,
                ],
            ],
        );
    }

    public function test_it_allows_app_http_requests_imports_in_actions(): void
    {
        $this->analyse(
            [__DIR__.'/fixtures/NoIlluminateHttpRequestImportRule/Actions/GoodAction.php'],
            [],
        );
    }

    public function test_it_allows_illuminate_request_in_non_action_files(): void
    {
        $this->analyse(
            [__DIR__.'/fixtures/NoIlluminateHttpRequestImportRule/Middleware/AllowedMiddleware.php'],
            [],
        );
    }

    protected function getRule(): Rule
    {
        return new NoIlluminateHttpRequestImportRule;
    }
}
