<?php

declare(strict_types=1);

namespace App\PHPStan\Rules;

use Illuminate\Http\Request;
use PhpParser\Node;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Identifier;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\IdentifierRuleError;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;
use PHPStan\Type\ObjectType;

/**
 * @implements Rule<MethodCall>
 */
final class NoRequestInputGetRule implements Rule
{
    public function getNodeType(): string
    {
        return MethodCall::class;
    }

    /**
     * @return list<IdentifierRuleError>
     */
    public function processNode(Node $node, Scope $scope): array
    {
        if (! $node->name instanceof Identifier) {
            return [];
        }

        $methodName = mb_strtolower($node->name->toString());

        if (! in_array($methodName, ['input', 'get'], true)) {
            return [];
        }

        $requestType = new ObjectType(Request::class);

        if (! $requestType->isSuperTypeOf($scope->getType($node->var))->yes()) {
            return [];
        }

        return [
            RuleErrorBuilder::message(sprintf(
                'Do not use Request::%s(). Use type-safe request accessors like string(), integer(), boolean(), array(), date(), enum(), or validated() instead.',
                $node->name->toString(),
            ))
                ->identifier('laravel.request.noUntypedInputAccessor')
                ->line($node->getLine())
                ->build(),
        ];
    }
}
