<?php

return [
    'customer_email_domain' => env('CONVIVE_CUSTOMER_EMAIL_DOMAIN', 'platform.com'),

    // Seeded platform-admin login. Override both on every real deploy — the
    // fallbacks are local-dev only and must never reach production.
    'admin' => [
        'email' => env('ADMIN_EMAIL', 'you@platform.com'),
        'password' => env('ADMIN_PASSWORD', 'admin-change-me'),
    ],
];
