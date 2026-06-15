import { useState } from 'react';
import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import FullPageScroller from '../../components/shared/FullPageScroller';
import GoldenParticles from '../../components/invitation/GoldenParticles';
import RoseraieOpening from './RoseraieOpening';
import { RoseraieHero, RoseraieLetter, RoseraieDate, RoseraiePhotos } from './RoseraieScenes';
import { RoseraieTime, RoseraieCountdown, RoseraieVenue, RoseraieRsvp } from './RoseraieSections';
import { ROSERAIE_STRINGS } from './RoseraieStrings';
import '../../css/invitation.css';
import '../../css/roseraie.css';

/**
 * Roseraie — the couture editorial flagship. A sealed botanical keepsake parts
 * to present an editorial spread on sage, ivory and antique gold.
 */
export default function RoseraieInvitation({ data, isDemo, onRsvp }) {
    // The scroller is mounted behind the cover so the parting panels reveal it
    // directly. `opened` flips once the cover has finished + unmounted, which
    // unlocks scroll and scroller input.
    const [opened, setOpened] = useState(false);
    const { guest, wedding } = data;
    const strings = ROSERAIE_STRINGS;

    useInvitationScroll(opened);

    const bride = wedding.bride_name || 'Amina';
    const groom = wedding.groom_name || 'Yacine';
    const message = isDemo ? '' : wedding.message;

    return (
        <div className="invitation-root roseraie-invitation">
            <GoldenParticles count={26} />
            <FullPageScroller enabled={opened} className="roseraie-fp" labels={strings.nav} rsvpIndex={7} rsvpLabel={strings.rsvp.cta}>
                <RoseraieHero bride={bride} groom={groom} eventDate={wedding.event_date} eventTime={wedding.event_time} venue={wedding.venue} strings={strings} />
                <RoseraieLetter guestName={guest.name} bride={bride} groom={groom} message={message} strings={strings} />
                <RoseraieDate eventDate={wedding.event_date} strings={strings} />
                <RoseraieTime eventTime={wedding.event_time} strings={strings} />
                <RoseraieCountdown eventDate={wedding.event_date} eventTime={wedding.event_time} strings={strings} />
                <RoseraieVenue venue={wedding.venue} venueAddress={wedding.venue_address} googleMapsUrl={wedding.google_maps_url} strings={strings} />
                <RoseraiePhotos photos={wedding.photos} strings={strings} />
                <RoseraieRsvp guestName={guest.name} initialStatus={guest.rsvp_status} onSubmit={onRsvp} isDemo={isDemo} bride={bride} groom={groom} strings={strings} />
            </FullPageScroller>
            {!opened && (
                <RoseraieOpening onComplete={() => setOpened(true)} bride={bride} groom={groom} guestName={guest.name} strings={strings} />
            )}
        </div>
    );
}
