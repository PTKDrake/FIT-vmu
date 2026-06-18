<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <script>
            (function () {
                try {
                    var theme = localStorage.getItem('theme');

                    if (!theme) {
                        theme = document.cookie
                            .split('; ')
                            .find(function (cookie) {
                                return cookie.indexOf('theme=') === 0;
                            })
                            ?.split('=')[1] || 'system';
                    }

                    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    var isDark = theme === 'dark' || (theme === 'system' && systemDark);

                    document.documentElement.classList.toggle('dark', isDark);
                    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
                } catch (error) {
                    // Ignore theme bootstrap errors and let the app recover on hydrate.
                }
            })();
        </script>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="any">
        <link rel="icon" href="{{ asset('logo.png') }}" type="image/png">

        <!-- Scripts -->
        @viteReactRefresh
        @vite(['resources/css/public.css', 'resources/css/app.css', 'web/app.tsx', "web/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
