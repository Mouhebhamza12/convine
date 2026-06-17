import roses from '../../assets/roseraie/roses.svg';

/**
 * Roseraie's deep background — the house's own rose cluster, set large and
 * faint in the margins. Because the journey is a one-slide-per-gesture pager
 * (no document scroll), the garden parallaxes off the active SLIDE INDEX:
 * advancing a section eases every bloom to a new offset, so the backdrop drifts
 * with the story. A slow idle sway keeps it alive between slides.
 */
const ITEMS = [
    { css: { top: '-6%', left: '-13%' }, size: 320, baseRot: -8, flip: false, range: 150, spin: 9, delay: '0s' },
    { css: { top: '10%', right: '-15%' }, size: 270, baseRot: 22, flip: true, range: -180, spin: -11, delay: '1.6s' },
    { css: { top: '42%', left: '-14%' }, size: 250, baseRot: 10, flip: false, range: 170, spin: 10, delay: '3.1s' },
    { css: { top: '58%', right: '-13%' }, size: 290, baseRot: -16, flip: true, range: -150, spin: -8, delay: '2.3s' },
    { css: { bottom: '-9%', left: '-11%' }, size: 240, baseRot: 14, flip: false, range: 140, spin: 8, delay: '4.2s' },
    { css: { bottom: '-7%', right: '-13%' }, size: 260, baseRot: -10, flip: true, range: -165, spin: -9, delay: '0.9s' },
];

export default function RoseraieGarden({ index = 0, count = 1 }) {
    const progress = count > 1 ? index / (count - 1) : 0.5;

    return (
        <div className="ro-rosebg" aria-hidden="true">
            {ITEMS.map((it, i) => {
                const y = (progress - 0.5) * it.range;
                const rot = (progress - 0.5) * it.spin;
                return (
                    <div
                        // eslint-disable-next-line react/no-array-index-key
                        key={i}
                        className="ro-rosebg__item"
                        style={{ ...it.css, transform: `translate3d(0, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)` }}
                    >
                        <span className="ro-rosebg__sway" style={{ animationDelay: it.delay }}>
                            <img
                                src={roses}
                                alt=""
                                style={{ width: it.size, transform: `${it.flip ? 'scaleX(-1) ' : ''}rotate(${it.baseRot}deg)` }}
                            />
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
