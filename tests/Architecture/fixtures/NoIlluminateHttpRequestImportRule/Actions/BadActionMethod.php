<?php

declare(strict_types=1);

namespace Tests\Architecture\fixtures\NoIlluminateHttpRequestImportRule\Actions;

use Illuminate\Http\Request;

final class BadActionMethod
{
    public function __invoke(
        Request $request,
    ): void {}
}
