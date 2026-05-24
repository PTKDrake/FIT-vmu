<?php

declare(strict_types=1);

if (! function_exists('flash')) {
    /**
     * @param  array<string, mixed>  $data
     */
    function flash(string $message, array $data = [], string $type = 'success'): void
    {
        session()->flash('message', $message);
        session()->flash('type', $type);
        session()->flash('data', $data);
    }
}
