<?php

declare(strict_types=1);

namespace Tests\Architecture\fixtures\NoIlluminateHttpRequestImportRule\Actions;

use Illuminate\Http\Request;
use Illuminate\Http\Request as BaseRequest;
use Illuminate\Http\Request as GroupedRequest;
use Illuminate\Http\Response;

final class BadAction
{
    public function __construct()
    {
        new Request;
        new BaseRequest;
        new GroupedRequest;
        new Response;
    }
}
