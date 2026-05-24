<?php

declare(strict_types=1);

namespace App\PHPStan\Rules;

use Illuminate\Database\Eloquent\Model as EloquentModel;
use PhpParser\Node;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\Node\Identifier;
use PhpParser\Node\Name;
use PHPStan\Analyser\Scope;
use PHPStan\Reflection\ReflectionProvider;
use PHPStan\Rules\IdentifierRuleError;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/**
 * @implements Rule<StaticCall>
 */
final readonly class RequireModelQueryStartRule implements Rule
{
    /**
     * @var list<string>
     */
    private const array ALLOWED_STATIC_METHODS = [
        'factory',
        'query',
    ];

    /**
     * @var list<string>
     */
    private const array FORBIDDEN_NATIVE_METHODS = [
        'all',
        'destroy',
    ];

    public function __construct(
        private ReflectionProvider $reflectionProvider,
    ) {}

    public function getNodeType(): string
    {
        return StaticCall::class;
    }

    /**
     * @return list<IdentifierRuleError>
     */
    public function processNode(Node $node, Scope $scope): array
    {
        if (! $node->name instanceof Identifier) {
            return [];
        }

        $className = $this->resolveClassName($node, $scope);

        if ($className === null || ! $this->reflectionProvider->hasClass($className)) {
            return [];
        }

        $classReflection = $this->reflectionProvider->getClass($className);
        $eloquentModelReflection = $this->reflectionProvider->getClass(EloquentModel::class);

        if (
            $classReflection->getName() !== EloquentModel::class
            && ! $classReflection->isSubclassOfClass($eloquentModelReflection)
        ) {
            return [];
        }

        $methodName = mb_strtolower($node->name->toString());

        if (in_array($methodName, self::ALLOWED_STATIC_METHODS, true)) {
            return [];
        }

        if (in_array($methodName, self::FORBIDDEN_NATIVE_METHODS, true)) {
            return [
                RuleErrorBuilder::message(sprintf(
                    'Do not call %s::%s() directly. Start with %s::query() and continue from the builder.',
                    $classReflection->getName(),
                    $node->name->toString(),
                    $classReflection->getName(),
                ))
                    ->identifier('laravel.model.requireQueryStart')
                    ->line($node->getLine())
                    ->build(),
            ];
        }

        if ($classReflection->hasNativeMethod($node->name->toString())) {
            return [];
        }

        return [
            RuleErrorBuilder::message(sprintf(
                'Do not call %s::%s() directly. Start with %s::query() and continue from the builder.',
                $classReflection->getName(),
                $node->name->toString(),
                $classReflection->getName(),
            ))
                ->identifier('laravel.model.requireQueryStart')
                ->line($node->getLine())
                ->build(),
        ];
    }

    private function resolveClassName(StaticCall $node, Scope $scope): ?string
    {
        if (! $node->class instanceof Name) {
            return null;
        }

        $rawClassName = mb_strtolower($node->class->toString());

        if (in_array($rawClassName, ['self', 'static', 'parent'], true)) {
            return null;
        }

        return $scope->resolveName($node->class);
    }
}
