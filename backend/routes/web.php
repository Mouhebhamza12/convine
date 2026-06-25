<?php

use App\Http\Controllers\InvitationOgController;
use App\Support\InvitationMeta;
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

/*
 * Invitation links are the thing people actually share (WhatsApp, Messages, …).
 * Link unfurlers do NOT run JavaScript, so we render the SPA shell with Open
 * Graph / Twitter tags injected server-side, personalised with the couple's
 * names, so a shared link previews as a titled, described card instead of a bare
 * URL. The default tags in index.html sit between <!-- og:start --> / <!-- og:end -->
 * markers; here we swap that whole block for the personalised one. This never
 * blocks the page: any lookup failure falls back to the generic tags.
 */
// The personalised share image (1200x630) for an invitation link.
Route::get('/invite/{token}/og.png', [InvitationOgController::class, 'show']);

Route::get('/invite/{token}', function (string $token) {
    $index = public_path('index.html');

    abort_unless(is_file($index), 503, 'Frontend build not found. Run `npm run build` in frontend/ before serving.');

    $html = (string) file_get_contents($index);

    $meta = InvitationMeta::forToken($token);
    $couple = $meta['couple'];
    $dateLabel = $meta['dateLabel'];

    $title = $couple !== '' ? "{$couple} · You're Invited" : "You're Invited · A Wedding Invitation";

    if ($couple !== '') {
        $desc = $dateLabel
            ? "{$couple} are getting married on {$dateLabel}. Tap to open your invitation and RSVP."
            : "{$couple} are getting married. Tap to open your invitation and RSVP.";
    } else {
        $desc = 'Tap to open your invitation and RSVP.';
    }

    $origin = request()->getSchemeAndHttpHost();
    $url = $origin.request()->getRequestUri();
    $image = $origin.'/invite/'.rawurlencode($token).'/og.png';
    $e = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');

    $tags = implode("\n        ", [
        '<!-- og:start -->',
        '<title>'.$e($title).'</title>',
        '<meta property="og:type" content="website" />',
        '<meta property="og:site_name" content="Convive" />',
        '<meta property="og:url" content="'.$e($url).'" />',
        '<meta property="og:title" content="'.$e($title).'" />',
        '<meta property="og:description" content="'.$e($desc).'" />',
        '<meta property="og:image" content="'.$e($image).'" />',
        '<meta property="og:image:width" content="1200" />',
        '<meta property="og:image:height" content="630" />',
        '<meta name="twitter:card" content="summary_large_image" />',
        '<meta name="twitter:title" content="'.$e($title).'" />',
        '<meta name="twitter:description" content="'.$e($desc).'" />',
        '<meta name="twitter:image" content="'.$e($image).'" />',
        '<!-- og:end -->',
    ]);

    // Match the whole default OG block (the opening marker carries an explanatory
    // note) and swap it for the personalised one. A callback avoids `$`/backslash
    // in a couple's name being treated as a replacement backreference.
    $personalised = preg_replace_callback(
        '/<!-- og:start.*?<!-- og:end -->/s',
        static fn () => $tags,
        $html,
        1,
        $count
    );
    if ($count > 0 && $personalised !== null) {
        $html = $personalised;
    }

    return response($html, 200, [
        'Content-Type' => 'text/html; charset=UTF-8',
        'Cache-Control' => 'no-cache, must-revalidate',
    ]);
});

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
