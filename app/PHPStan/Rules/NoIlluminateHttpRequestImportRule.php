<?php

declare(strict_types=1);

namespace App\PHPStan\Rules;

use Illuminate\Http\Request as IlluminateRequest;
use PhpParser\Node;
use PhpParser\Node\Name;
use PhpParser\Node\NullableType;
use PhpParser\Node\Stmt;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Stmt\GroupUse;
use PhpParser\Node\Stmt\Use_;
use PhpParser\Node\UnionType;
use PhpParser\Node\UseItem;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\IdentifierRuleError;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/**
 * @implements Rule<Stmt>
 */
final class NoIlluminateHttpRequestImportRule implements Rule
{
    public function getNodeType(): string
    {
        return Stmt::class;
    }

    /**
     * @return list<IdentifierRuleError>
     */
    public function processNode(Node $node, Scope $scope): array
    {
        $file = $scope->getFile();
        if (! str_contains($file, '/Actions/')) {
            return [];
        }

        if ($node instanceof Use_) {
            return $this->checkUses(
                prefix: '',
                uses: $node->uses,
            );
        }

        if ($node instanceof GroupUse) {
            return $this->checkUses(
                prefix: $node->prefix->toString(),
                uses: $node->uses,
            );
        }

        if ($node instanceof ClassMethod) {
            return $this->checkMethodParameters($node);
        }

        return [];
    }

    /**
     * @param  array<UseItem>  $uses
     * @return list<IdentifierRuleError>
     */
    private function checkUses(string $prefix, array $uses): array
    {
        $errors = [];

        foreach ($uses as $use) {
            $importedName = mb_ltrim(
                ($prefix !== '' ? $prefix.'\\' : '').$use->name->toString(),
                '\\',
            );

            if ($importedName !== IlluminateRequest::class) {
                continue;
            }

            $errors[] = RuleErrorBuilder::message(
                'Do not use Illuminate\Http\Request in actions. Use an app-specific request class from App\Http\Requests instead.'
            )
                ->identifier('laravel.request.noIlluminateImport')
                ->line($use->getLine())
                ->build();
        }

        return $errors;
    }

    /**
     * @return list<IdentifierRuleError>
     */
    private function checkMethodParameters(ClassMethod $method): array
    {
        $errors = [];

        foreach ($method->params as $param) {
            $type = $param->type;
            if (! $type instanceof Node) {
                continue;
            }

            if ($this->isIlluminateRequestType($type)) {
                $errors[] = RuleErrorBuilder::message(
                    'Do not use Illuminate\Http\Request in actions. Use an app-specific request class from App\Http\Requests instead.'
                )
                    ->identifier('laravel.request.noIlluminateImport')
                    ->line($param->getLine())
                    ->build();
            }
        }

        return $errors;
    }

    private function isIlluminateRequestType(Node $type): bool
    {
        if ($type instanceof NullableType) {
            return $this->isIlluminateRequestType($type->type);
        }

        if ($type instanceof UnionType) {
            foreach ($type->types as $subType) {
                if ($this->isIlluminateRequestType($subType)) {
                    return true;
                }
            }

            return false;
        }

        if (! $type instanceof Name) {
            return false;
        }

        return mb_ltrim($type->toString(), '\\') === IlluminateRequest::class;
    }
}
