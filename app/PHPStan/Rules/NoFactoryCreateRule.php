<?php

declare(strict_types=1);

namespace App\PHPStan\Rules;

use Illuminate\Database\Eloquent\Factories\Factory as EloquentFactory;
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
final class NoFactoryCreateRule implements Rule
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

        if (mb_strtolower($node->name->toString()) !== 'create') {
            return [];
        }

        $factoryType = new ObjectType(EloquentFactory::class);

        if (! $factoryType->isSuperTypeOf($scope->getType($node->var))->yes()) {
            return [];
        }

        return [
            RuleErrorBuilder::message('Do not call Factory::create(). Use createOne() for a single model or createMany() for multiple models.')
                ->identifier('laravel.factory.create')
                ->build(),
        ];
    }
}
