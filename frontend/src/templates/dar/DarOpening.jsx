import AndalusCurtain from './AndalusCurtain/AndalusCurtain';

/**
 * DarOpening — the Andalus reveal.
 *
 * The old flat-SVG curtain was retired; this now renders the real WebGL
 * cloth-simulated velvet curtain (./AndalusCurtain/). Same contract as before:
 * fires onComplete once the drapes have parted and the scene has dissolved.
 */
export default function DarOpening({ onComplete, strings }) {
    return <AndalusCurtain onComplete={onComplete} strings={strings} />;
}
