<?php

namespace App\Support;

use App\Models\Guest;

/**
 * Resolves the share-preview facts (couple, date, locale) for an invitation
 * link, shared by the server-side Open Graph injection and the OG image. Always
 * safe: any lookup failure yields generic values rather than throwing, so a
 * preview can never break the invitation page.
 */
class InvitationMeta
{
    /** demo token => the template it previews */
    private const DEMO_TEMPLATES = [
        'demo' => 'velvet',
        'demo-sage' => 'sage',
        'demo-azure' => 'azure',
        'demo-roseraie' => 'roseraie',
        'demo-ivoire' => 'ivoire',
    ];

    /**
     * @return array{bride: ?string, groom: ?string, couple: string, locale: string, dateLabel: ?string, template: ?string}
     */
    public static function forToken(string $token): array
    {
        $bride = null;
        $groom = null;
        $date = null;
        $locale = 'en';
        $template = null;

        try {
            if (isset(self::DEMO_TEMPLATES[$token])) {
                $bride = 'Amina';
                $groom = 'Yacine';
                $date = \Illuminate\Support\Carbon::parse('2026-08-20');
                $template = self::DEMO_TEMPLATES[$token];
            } else {
                $wedding = Guest::query()->where('token', $token)->first()?->wedding;
                if ($wedding) {
                    $bride = $wedding->bride_name;
                    $groom = $wedding->groom_name;
                    $date = $wedding->event_date;
                    $locale = $wedding->locale ?: 'en';
                    $template = $wedding->template_slug;
                }
            }
        } catch (\Throwable $e) {
            // generic fallback below
        }

        $couple = trim(implode(' & ', array_filter([$bride, $groom])));

        // The card type is Latin-only, so format the date in a Latin-safe locale
        // (Algerian Arabic invitations fall back to French month names).
        $cardLocale = $locale === 'ar' ? 'fr' : $locale;
        $dateLabel = $date ? $date->locale($cardLocale)->isoFormat('D MMMM YYYY') : null;

        return compact('bride', 'groom', 'couple', 'locale', 'dateLabel', 'template');
    }
}
