<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    @php
        $siteName = config('app.name', 'VMUFit');
        $siteDescription = 'Khoa Công nghệ thông tin - Trường Đại học Hàng hải Việt Nam.';
        $previewImage = asset('logo.png');
    @endphp
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

        <title inertia>{{ $siteName }}</title>
        <meta data-inertia="description" name="description" content="{{ $siteDescription }}">
        <meta data-inertia="og:type" property="og:type" content="website">
        <meta data-inertia="og:site_name" property="og:site_name" content="{{ $siteName }}">
        <meta data-inertia="og:title" property="og:title" content="{{ $siteName }}">
        <meta data-inertia="og:description" property="og:description" content="{{ $siteDescription }}">
        <meta data-inertia="og:url" property="og:url" content="{{ url()->current() }}">
        <meta data-inertia="og:image" property="og:image" content="{{ $previewImage }}">
        <meta data-inertia="og:image:secure_url" property="og:image:secure_url" content="{{ $previewImage }}">
        <meta data-inertia="og:image:type" property="og:image:type" content="image/png">
        <meta data-inertia="og:image:width" property="og:image:width" content="300">
        <meta data-inertia="og:image:height" property="og:image:height" content="300">
        <meta data-inertia="og:image:alt" property="og:image:alt" content="{{ $siteName }}">
        <meta data-inertia="twitter:card" name="twitter:card" content="summary">
        <meta data-inertia="twitter:title" name="twitter:title" content="{{ $siteName }}">
        <meta data-inertia="twitter:description" name="twitter:description" content="{{ $siteDescription }}">
        <meta data-inertia="twitter:image" name="twitter:image" content="{{ $previewImage }}">
        <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="any">
        <link rel="icon" href="{{ asset('logo.png') }}" type="image/png">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
        >

        <!-- Scripts -->
        @viteReactRefresh
        @vite(['resources/css/public.css', 'resources/css/app.css', 'web/app.tsx', "web/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
