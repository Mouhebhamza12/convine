<?php

use Illuminate\Support\Facades\Route;

/*
 * Serve the built single-page app. Vite builds the React frontend into this
 * app's public/ directory (outDir = ../backend/public), so index.html and the
 * hashed /assets sit next to Laravel's front controller. Existing files
 * (/assets/*, favicon, etc.) are served directly by the web server; every other
 * non-API path returns the SPA shell and React Router takes over client-side
 * (/, /login, /admin, /dashboard, /invite/:token).
 */
$spa = function () {
    $index = public_path('index.html');

    abort_unless(
        is_file($index),
        503,
        'Frontend build not found. Run `npm run build` in frontend/ before serving.'
    );

    // no-cache on the shell so a deploy's new asset hashes are picked up
    // immediately instead of a stale cached index pointing at deleted bundles.
    return response()->file($index, ['Cache-Control' => 'no-cache, must-revalidate']);
};

Route::get('/', $spa);

// Anything not matched above and not an /api/* call is a client-side route.
// A request that looks like a file (has an extension) but reached here means the
// asset is missing — 404 it rather than handing back the SPA shell as text/html,
// which would otherwise feed HTML to an <img>/<audio>/<script> tag.
Route::fallback(function () use ($spa) {
    abort_if(
        request()->is('api/*') || preg_match('/\.[A-Za-z0-9]+$/', request()->path()) === 1,
        404
    );

    return $spa();
});
