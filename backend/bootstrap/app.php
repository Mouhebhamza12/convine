<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: 'api',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin' => \App\Http\Middleware\EnsureAdmin::class,
        ]);

        // Defensive browser-security headers on every response.
        $middleware->append(\App\Http\Middleware\SecurityHeaders::class);

        // NOTE: we deliberately do NOT call $middleware->statefulApi().
        //
        // This app is a same-origin SPA: the browser talks to the Vite dev
        // server (or the built assets) and every /api/* request is wrapped in
        // the `web` middleware group (see routes/api.php), which already boots
        // the session, encrypts cookies and validates CSRF. Sanctum's
        // statefulApi() would layer a SECOND copy of those same middlewares on
        // top, so StartSession / EncryptCookies / CSRF would run twice per
        // request. The two passes fight over the Set-Cookie header — after
        // session()->regenerate() on login the browser could be handed the
        // pre-regeneration session id, so the very next request came back
        // "Unauthenticated" and the user was kicked out. We use no Sanctum API
        // tokens anywhere, so a single web-group/session pipeline is all we
        // need and it works on any host (localhost, 127.0.0.1, LAN IP, phone)
        // without depending on SANCTUM_STATEFUL_DOMAINS matching the port.
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })->create();
