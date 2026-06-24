import { useState } from 'react';
import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import FullPageScroller from '../../components/shared/FullPageScroller';
import RoseraieOpening from './RoseraieOpening';
import RoseraieGarden from './RoseraieGarden';
import { RoseraieHero, RoseraieLetter, RoseraieDate, RoseraiePhotos } from './RoseraieScenes';
import { RoseraieTime, RoseraieCountdown, RoseraieVenue, RoseraieRsvp } from './RoseraieSections';
import { roseraieStrings } from './RoseraieStrings';
import '../../css/invitation.css';
import '../../css/roseraie.css';

/**
 * Roseraie-couture editorial flagship. A sealed botanical keepsake parts to
 * present an editorial spread. All ornament is real vector artwork (the
 * provided floral/damask assets); the page draws nothing in code.
 *
 * `locale` is chosen by the couple at creation and arrives baked into the data;
 * the template renders that one language (no guest-facing switcher). Arabic
 * flips the whole composition to RTL via `strings.dir`.
 */
export default function RoseraieInvitation({ data, isDemo, onRsvp, locale = 'en' }) {
    const [opened, setOpened] = useState(false);
    const [slide, setSlide] = useState(0);
    const { guest, wedding } = data;
    const strings = roseraieStrings(locale);
    const rtl = strings.dir === 'rtl';

    useInvitationScroll(opened);

    const bride = wedding.bride_name || 'Amina';
    const groom = wedding.groom_name || 'Yacine';
    const message = isDemo ? '' : wedding.message;

    return (
        <div className="invitation-root roseraie-invitation" lang={strings.code} dir={strings.dir}>
            {opened && <RoseraieGarden index={slide} count={8} />}
            <FullPageScroller enabled={opened} className="roseraie-fp" labels={strings.nav} rtl={rtl} onIndexChange={setSlide} rsvpIndex={7} rsvpLabel={strings.rsvp.cta}>
                <RoseraieHero bride={bride} groom={groom} eventDate={wedding.event_date} eventTime={wedding.event_time} venue={wedding.venue} strings={strings} />
                <RoseraieLetter guestName={guest.name} bride={bride} groom={groom} message={message} strings={strings} />
                <RoseraieDate eventDate={wedding.event_date} strings={strings} />
                <RoseraieTime eventTime={wedding.event_time} strings={strings} />
                <RoseraieCountdown eventDate={wedding.event_date} eventTime={wedding.event_time} strings={strings} />
                <RoseraieVenue venue={wedding.venue} venueAddress={wedding.venue_address} googleMapsUrl={wedding.google_maps_url} strings={strings} />
                <RoseraiePhotos photos={wedding.photos} strings={strings} />
                <RoseraieRsvp guestName={guest.name} initialStatus={guest.rsvp_status} onSubmit={onRsvp} isDemo={isDemo} strings={strings} />
            </FullPageScroller>
            {!opened && <RoseraieOpening onComplete={() => setOpened(true)} />}
        </div>
    );
}
