<?php

test('csrf is disabled during tests', function () {
    expect(app()->environment())->toBe('testing');
    expect(app()->bound('env'))->toBeTrue();
    expect(app()['env'])->toBe('testing');
    expect(app()->runningUnitTests())->toBeTrue();
    expect(app()->runningInConsole())->toBeTrue();
});
