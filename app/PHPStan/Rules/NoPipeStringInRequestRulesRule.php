<?php

declare(strict_types=1);

namespace App\PHPStan\Rules;

use Illuminate\Foundation\Http\FormRequest;
use PhpParser\Node;
use PhpParser\Node\Expr\Array_;
use PhpParser\Node\Scalar\String_;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Stmt\Return_;
use PhpParser\NodeFinder;
use PHPStan\Analyser\Scope;
use PHPStan\Reflection\ClassReflection;
use PHPStan\Reflection\ReflectionProvider;
use PHPStan\Rules\IdentifierRuleError;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/**
 * @implements Rule<ClassMethod>
 */
final readonly class NoPipeStringInRequestRulesRule implements Rule
{
    public function __construct(
        private ReflectionProvider $reflectionProvider,
    ) {}

    public function getNodeType(): string
    {
        return ClassMethod::class;
    }

    /**
     * @return list<IdentifierRuleError>
     */
    public function processNode(Node $node, Scope $scope): array
    {
        if ($node->name->toString() !== 'rules') {
            return [];
        }

        $classReflection = $scope->getClassReflection();
        if (! $classReflection instanceof ClassReflection) {
            return [];
        }

        $formRequestReflection = $this->reflectionProvider->getClass(FormRequest::class);

        if (
            $classReflection->getName() !== FormRequest::class
            && ! $classReflection->isSubclassOfClass($formRequestReflection)
        ) {
            return [];
        }

        $errors = [];
        $finder = new NodeFinder;

        /** @var list<Return_> $returns */
        $returns = $finder->findInstanceOf($node->stmts ?? [], Return_::class);

        foreach ($returns as $return) {
            if (! $return->expr instanceof Array_) {
                continue;
            }

            foreach ($this->findPipeRuleStrings($return->expr) as $string) {
                $errors[] = RuleErrorBuilder::message(
                    'FormRequest rules must use array syntax. Do not use pipe-delimited rule strings.'
                )
                    ->identifier('laravel.request.noPipeRuleString')
                    ->line($string->getLine())
                    ->build();
            }
        }

        return $errors;
    }

    /**
     * @return list<String_>
     */
    private function findPipeRuleStrings(Array_ $array): array
    {
        $strings = [];

        foreach ($array->items as $item) {
            if ($item->value instanceof String_ && str_contains($item->value->value, '|')) {
                $strings[] = $item->value;

                continue;
            }

            if ($item->value instanceof Array_) {
                $strings = array_merge($strings, $this->findPipeRuleStrings($item->value));
            }
        }

        return $strings;
    }
}
