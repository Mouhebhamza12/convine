import { useState } from 'react';
import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import FullPageScroller from '../../components/shared/FullPageScroller';
import GoldenParticles from '../../components/invitation/GoldenParticles';
import DarOpening from './DarOpening';
import { DarHero, DarMarhba, DarDate, DarPhotos } from './DarScenes';
import { DarTime, DarCountdown, DarVenue, DarRsvp } from './DarSections';
import { DAR_STRINGS, AR_DEMO_NAMES } from './DarStrings';
import '../../css/invitation.css';
import '../../css/dar.css';
import '../../css/andalus.css';

/**
 * Dar — the flagship Algerian template. One layout, two voices:
 * lang='fr' (elegant, premium) and lang='ar' (warm, RTL, authentic).
 * Never both at once.
 */
function DarInvitation({ data, isDemo, onRsvp, lang }) {
    // The invitation is always mounted behind the curtain so the parting drapes
    // reveal it directly (no blank background flash). `done` flips once the
    // curtain has finished and unmounted, which unlocks scrolling + scroller input.
    const [done, setDone] = useState(false);
    const { guest, wedding } = data;
    const strings = DAR_STRINGS[lang];

    useInvitationScroll(done);

    let bride = wedding.bride_name || 'Amina';
    let groom = wedding.groom_name || 'Yacine';
    let guestName = guest.name;
    if (lang === 'ar' && isDemo) {
        bride = AR_DEMO_NAMES[bride] || bride;
        groom = AR_DEMO_NAMES[groom] || groom;
        guestName = AR_DEMO_NAMES[guestName] || guestName;
    }
    // The owner-entered message is shown as-is; the per-language default is
    // only used when none was written (the demo message is English, skip it).
    const message = isDemo ? '' : wedding.message;

    return (
        <div className="invitation-root dar-invitation" dir={strings.dir} lang={lang} data-lang={lang}>
            <GoldenParticles count={35} />
            <FullPageScroller enabled={done} className="dar-fp" labels={strings.nav} rtl={strings.dir === 'rtl'} rsvpIndex={7} rsvpLabel={strings.rsvp.cta}>
                <DarHero bride={bride} groom={groom} eventDate={wedding.event_date} eventTime={wedding.event_time} venue={wedding.venue} venueAddress={wedding.venue_address} strings={strings} lang={lang} />
                <DarMarhba guestName={guestName} message={message} strings={strings} />
                <DarDate eventDate={wedding.event_date} strings={strings} lang={lang} />
                <DarTime eventTime={wedding.event_time} strings={strings} lang={lang} />
                <DarCountdown eventDate={wedding.event_date} eventTime={wedding.event_time} strings={strings} />
                <DarVenue venue={wedding.venue} venueAddress={wedding.venue_address} googleMapsUrl={wedding.google_maps_url} strings={strings} />
                <DarPhotos photos={wedding.photos} strings={strings} />
                <DarRsvp guestName={guestName} initialStatus={guest.rsvp_status} onSubmit={onRsvp} isDemo={isDemo} strings={strings} />
            </FullPageScroller>
            {!done && <DarOpening onComplete={() => setDone(true)} strings={strings} />}
        </div>
    );
}

export function DarInvitationFr(props) {
    return <DarInvitation {...props} lang="fr" />;
}

export function DarInvitationAr(props) {
    return <DarInvitation {...props} lang="ar" />;
}
