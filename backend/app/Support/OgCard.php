<?php

namespace App\Support;

/**
 * Renders the social-share ("link unfurl") preview card as a 1200x630 PNG with
 * GD. Drawn at 2x and downsampled for crisp type. Both the palette AND the
 * typeface theme themselves to the chosen template, so the preview reads as a
 * teaser of the real invitation: Velvet is cinematic burgundy + gold Prata with
 * a Pinyon Script ampersand, Sage botanical green in Dancing Script, Azure blue
 * Playfair, Ivoire rose-gold Cinzel, and so on.
 *
 * GD/FreeType has no Arabic shaping engine, so Arabic-script names cannot be
 * drawn here; callers detect that with `isRenderable()` and fall back to the
 * generic card (the Arabic names still ride in the og:title text, which the
 * chat app itself shapes correctly).
 */
class OgCard
{
    private const W = 1200;
    private const H = 630;
    private const S = 2;

    /** Per-template palette: gradient bg1/bg2, ink (names), accent (ampersand +
     *  divider), muted (kicker + date), frame. */
    private const THEMES = [
        'velvet'   => ['bg1' => '5a0d16', 'bg2' => '2c060b', 'ink' => 'f1d9a6', 'accent' => 'caa45c', 'muted' => 'd8bf98', 'frame' => 'a9823f'],
        'sage'     => ['bg1' => 'f3f5ec', 'bg2' => 'e3e9d4', 'ink' => '3f4f2f', 'accent' => '6f7d50', 'muted' => '77785f', 'frame' => '9aa46f'],
        'azure'    => ['bg1' => 'f7f2e6', 'bg2' => 'e7eef8', 'ink' => '27557f', 'accent' => '3f73b5', 'muted' => '6f6a59', 'frame' => '9bb6da'],
        'roseraie' => ['bg1' => 'fdf7f1', 'bg2' => 'f6e6e3', 'ink' => '691a2e', 'accent' => 'c25e7e', 'muted' => '8a6b72', 'frame' => 'c9a06a'],
        'ivoire'   => ['bg1' => 'f7f0e6', 'bg2' => 'efe1d0', 'ink' => '7a4a58', 'accent' => 'b0824a', 'muted' => '9c8478', 'frame' => 'c2a064'],
        'default'  => ['bg1' => 'faf7f1', 'bg2' => 'ede4d6', 'ink' => '6b1320', 'accent' => 'b0894c', 'muted' => '8a7560', 'frame' => 'b0894c'],
    ];

    /** Per-template fonts: name (the hero), amp (the ampersand, often a script),
     *  ampScale (sizing for that ampersand), label (kicker/date/brand). */
    private const FONTS = [
        'velvet'   => ['name' => 'Prata-Regular.ttf',   'amp' => 'PinyonScript-Regular.ttf', 'ampScale' => 1.3, 'label' => 'EBGaramond.ttf'],
        'sage'     => ['name' => 'DancingScript.ttf',   'amp' => 'DancingScript.ttf',        'ampScale' => 1.0, 'label' => 'EBGaramond.ttf'],
        'azure'    => ['name' => 'PlayfairDisplay.ttf', 'amp' => 'PlayfairDisplay.ttf',      'ampScale' => 1.0, 'label' => 'Jost.ttf'],
        'roseraie' => ['name' => 'Prata-Regular.ttf',   'amp' => 'PinyonScript-Regular.ttf', 'ampScale' => 1.3, 'label' => 'Jost.ttf'],
        'ivoire'   => ['name' => 'Cinzel.ttf',          'amp' => 'Cinzel.ttf',               'ampScale' => 1.0, 'label' => 'EBGaramond.ttf'],
        'default'  => ['name' => 'EBGaramond.ttf',      'amp' => 'EBGaramond.ttf',           'ampScale' => 1.0, 'label' => 'Marcellus-Regular.ttf'],
    ];

    public static function isRenderable(string $text): bool
    {
        return $text !== '' && ! preg_match('/\p{Arabic}/u', $text);
    }

    public static function themeFor(?string $slug): array
    {
        return self::THEMES[self::canonical($slug)] ?? self::THEMES['default'];
    }

    /** Personalised card for a template. Returns PNG bytes. */
    public static function couple(string $bride, string $groom, ?string $dateLabel = null, ?string $slug = null): string
    {
        $f = self::fontsFor($slug);

        return self::draw(self::themeFor($slug), function ($img, $W, $S, $ink, $accent, $muted) use ($bride, $groom, $dateLabel, $f) {
            self::center($img, 30 * $S, $f['label'], $muted, 212 * $S, 'the wedding of', $W);

            $size = self::fit($f['name'], trim($bride.'  '.$groom), $W - 240 * $S, 86 * $S, 36 * $S);
            self::names($img, $size, $f, $ink, $accent, 352 * $S, $bride, $groom, $W);

            self::divider($img, $W, $S, $accent, 410 * $S);

            if (trim((string) $dateLabel) !== '') {
                self::center($img, 40 * $S, $f['label'], $muted, 482 * $S, $dateLabel, $W);
            }

            self::center($img, 25 * $S, $f['label'], $accent, 566 * $S, 'convivecards.me', $W);
        });
    }

    /** Generic card (homepage, demos without names, fallbacks). */
    public static function generic(?string $slug = null): string
    {
        $f = self::fontsFor($slug);

        return self::draw(self::themeFor($slug), function ($img, $W, $S, $ink, $accent, $muted) use ($f) {
            self::center($img, 30 * $S, $f['label'], $muted, 226 * $S, 'a wedding invitation', $W);
            self::center($img, 86 * $S, $f['name'], $ink, 372 * $S, "You're Invited", $W);
            self::divider($img, $W, $S, $accent, 432 * $S);
            self::center($img, 34 * $S, $f['label'], $muted, 500 * $S, 'tap to open your invitation', $W);
            self::center($img, 25 * $S, $f['label'], $accent, 566 * $S, 'convivecards.me', $W);
        });
    }

    private static function draw(array $theme, callable $content): string
    {
        $W = self::W * self::S;
        $H = self::H * self::S;
        $img = imagecreatetruecolor($W, $H);
        imagealphablending($img, true);

        [$r1, $g1, $b1] = self::rgb($theme['bg1']);
        [$r2, $g2, $b2] = self::rgb($theme['bg2']);
        for ($y = 0; $y < $H; $y++) {
            $t = $y / $H;
            $c = imagecolorallocate($img, (int) ($r1 + ($r2 - $r1) * $t), (int) ($g1 + ($g2 - $g1) * $t), (int) ($b1 + ($b2 - $b1) * $t));
            imageline($img, 0, $y, $W, $y, $c);
        }

        $ink = self::hex($img, $theme['ink']);
        $accent = self::hex($img, $theme['accent']);
        $muted = self::hex($img, $theme['muted']);
        $frame = self::hex($img, $theme['frame']);

        imagesetthickness($img, 2 * self::S);
        imagerectangle($img, 44 * self::S, 44 * self::S, $W - 44 * self::S, $H - 44 * self::S, $frame);

        $content($img, $W, self::S, $ink, $accent, $muted);

        $final = imagecreatetruecolor(self::W, self::H);
        imagecopyresampled($final, $img, 0, 0, 0, 0, self::W, self::H, $W, $H);

        ob_start();
        imagepng($final, null, 9);

        return (string) ob_get_clean();
    }

    private static function center($img, $size, $font, $color, $baselineY, $text, $W): void
    {
        $bb = imagettfbbox($size, 0, $font, $text);
        $x = (int) (($W - ($bb[2] - $bb[0])) / 2 - $bb[0]);
        imagettftext($img, $size, 0, $x, $baselineY, $color, $font, $text);
    }

    /** "Bride & Groom" centred: names in the hero font, the ampersand in the
     *  template's amp font (a script for Velvet/Roseraie) at its own scale. */
    private static function names($img, $size, array $f, $ink, $accent, $baselineY, $bride, $groom, $W): void
    {
        $name = $f['name'];
        $amp = $f['amp'];
        $ampSize = (int) round($size * $f['ampScale']);

        $wB = self::textW($name, $size, $bride.' ');
        $wA = self::textW($amp, $ampSize, '& ');
        $wG = self::textW($name, $size, $groom);
        $x = (int) (($W - ($wB + $wA + $wG)) / 2);

        $r1 = imagettftext($img, $size, 0, $x, $baselineY, $ink, $name, $bride.' ');
        $r2 = imagettftext($img, $ampSize, 0, $r1[2], $baselineY, $accent, $amp, '& ');
        imagettftext($img, $size, 0, $r2[2], $baselineY, $ink, $name, $groom);
    }

    private static function divider($img, $W, $S, $accent, $cy): void
    {
        $half = 150 * $S;
        $gap = 26 * $S;
        imagesetthickness($img, (int) (1.5 * $S));
        imageline($img, $W / 2 - $half, $cy, $W / 2 - $gap, $cy, $accent);
        imageline($img, $W / 2 + $gap, $cy, $W / 2 + $half, $cy, $accent);
        $d = 7 * $S;
        imagefilledpolygon($img, [$W / 2, $cy - $d, $W / 2 + $d, $cy, $W / 2, $cy + $d, $W / 2 - $d, $cy], $accent);
    }

    private static function fit($font, $text, $maxW, $start, $min): int
    {
        for ($s = $start; $s > $min; $s -= 1) {
            $bb = imagettfbbox($s, 0, $font, $text);
            if (($bb[2] - $bb[0]) <= $maxW) {
                return $s;
            }
        }
        return $min;
    }

    private static function textW($font, $size, $text): int
    {
        $b = imagettfbbox($size, 0, $font, $text);

        return $b[2] - $b[0];
    }

    private static function canonical(?string $slug): string
    {
        if ($slug === null || $slug === '') {
            return 'default';
        }
        $legacy = ['classic' => 'velvet', 'minimal' => 'sage'];
        $slug = $legacy[$slug] ?? $slug;

        return isset(self::THEMES[$slug]) ? $slug : 'default';
    }

    private static function fontsFor(?string $slug): array
    {
        $set = self::FONTS[self::canonical($slug)] ?? self::FONTS['default'];
        $dir = base_path('resources/og/fonts/');

        return [
            'name' => $dir.$set['name'],
            'amp' => $dir.$set['amp'],
            'ampScale' => $set['ampScale'],
            'label' => $dir.$set['label'],
        ];
    }

    private static function rgb(string $h): array
    {
        return [hexdec(substr($h, 0, 2)), hexdec(substr($h, 2, 2)), hexdec(substr($h, 4, 2))];
    }

    private static function hex($img, string $h)
    {
        [$r, $g, $b] = self::rgb($h);

        return imagecolorallocate($img, $r, $g, $b);
    }
}
