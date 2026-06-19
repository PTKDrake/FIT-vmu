<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI', '/auth/google/callback'),
    ],

    'openrouter' => [
        'api_key' => env('OPENROUTER_API_KEY'),
        'blocknote_model' => env('OPENROUTER_BLOCKNOTE_MODEL'),
        'blocknote_node_binary' => env('OPENROUTER_BLOCKNOTE_NODE_BINARY', 'node'),
        'blocknote_timeout' => env('OPENROUTER_BLOCKNOTE_TIMEOUT', 90),
        'app_name' => env('OPENROUTER_APP_NAME', env('APP_NAME')),
        'app_url' => env('OPENROUTER_APP_URL', env('APP_URL')),
    ],

    'nim' => [
        'api_key' => env('NIM_API_KEY'),
        'base_url' => env('NIM_BASE_URL', 'https://integrate.api.nvidia.com/v1'),
        'blocknote_model' => env('NIM_BLOCKNOTE_MODEL'),
    ],

    'blocknote_ai' => [
        'provider' => env('BLOCKNOTE_AI_PROVIDER', 'openrouter'),
        'node_binary' => env(
            'BLOCKNOTE_AI_NODE_BINARY',
            env('OPENROUTER_BLOCKNOTE_NODE_BINARY', 'node'),
        ),
        'timeout' => env(
            'BLOCKNOTE_AI_TIMEOUT',
            env('OPENROUTER_BLOCKNOTE_TIMEOUT', 90),
        ),
        'openrouter' => [
            'api_key' => env('BLOCKNOTE_AI_OPENROUTER_API_KEY', env('OPENROUTER_API_KEY')),
            'model' => env(
                'BLOCKNOTE_AI_OPENROUTER_MODEL',
                env('OPENROUTER_BLOCKNOTE_MODEL'),
            ),
            'app_name' => env('BLOCKNOTE_AI_OPENROUTER_APP_NAME', env('OPENROUTER_APP_NAME', env('APP_NAME'))),
            'app_url' => env('BLOCKNOTE_AI_OPENROUTER_APP_URL', env('OPENROUTER_APP_URL', env('APP_URL'))),
        ],
        'nim' => [
            'api_key' => env('BLOCKNOTE_AI_NIM_API_KEY', env('NIM_API_KEY')),
            'model' => env('BLOCKNOTE_AI_NIM_MODEL', env('NIM_BLOCKNOTE_MODEL')),
            'base_url' => env(
                'BLOCKNOTE_AI_NIM_BASE_URL',
                env('NIM_BASE_URL', 'https://integrate.api.nvidia.com/v1'),
            ),
        ],
    ],

    'admin_seed_password' => env('ADMIN_SEED_PASSWORD'),

];
