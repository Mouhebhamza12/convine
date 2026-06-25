<?php

namespace App\Http\Controllers;

use App\Support\InvitationMeta;
use App\Support\OgCard;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InvitationOgController extends Controller
{
    /**
     * The 1200x630 social-share image for an invitation link. Personalised with
     * the couple's names + date when they are Latin-script; otherwise (Arabic
     * names, or no names yet) a polished generic card. Never errors out: any
     * failure falls back to the generic card so the og:image always resolves.
     */
    public function show(Request $request, string $token): Response
    {
        $headers = [
            'Content-Type' => 'image/png',
            // Crawlers re-fetch occasionally; a day of caching is plenty and the
            // image changes only when the couple edits their names/date.
            'Cache-Control' => 'public, max-age=86400',
        ];

        try {
            $meta = InvitationMeta::forToken($token);

            $png = OgCard::isRenderable($meta['couple'])
                ? OgCard::couple((string) $meta['bride'], (string) $meta['groom'], $meta['dateLabel'], $meta['template'])
                : OgCard::generic($meta['template']);

            return response($png, 200, $headers);
        } catch (\Throwable $e) {
            try {
                return response(OgCard::generic(), 200, $headers);
            } catch (\Throwable $e2) {
                // last resort: the static file shipped with the build
                $fallback = public_path('og-image.png');
                abort_unless(is_file($fallback), 404);

                return response()->file($fallback, $headers);
            }
        }
    }
}
