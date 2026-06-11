import { useState } from 'react';
import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import WeddingTime from '../../components/invitation/WeddingTime';
import Countdown from '../../components/invitation/Countdown';
import Location from '../../components/invitation/Location';
import RSVP from '../../components/invitation/RSVP';
import SageOpening from './SageOpening';
import { SageDetails, SageLetter, SagePhotos } from './SageScenes';
import '../../css/invitation.css';
import '../../css/sage.css';

export default function SageInvitation({ data, isDemo, onRsvp }) {
    const [opened, setOpened] = useState(false);
    const { guest, wedding } = data;

    useInvitationScroll(opened);

    const bride = wedding.bride_name || 'Amina';
    const groom = wedding.groom_name || 'Yacine';

    return (
        <div className="invitation-root sage-invitation">
            {!opened && (
                <SageOpening
                    onComplete={() => setOpened(true)}
                    bride={bride}
                    groom={groom}
                    guestName={guest.name}
                />
            )}
            <main className={`invitation-story${opened ? ' is-visible' : ''}`}>
                <SageDetails
                    bride={bride}
                    groom={groom}
                    eventDate={wedding.event_date}
                    eventTime={wedding.event_time}
                    venue={wedding.venue}
                    venueAddress={wedding.venue_address}
                />
                <WeddingTime eventTime={wedding.event_time} />
                <SageLetter guestName={guest.name} bride={bride} groom={groom} message={wedding.message} />
                <SagePhotos photos={wedding.photos} />
                <Countdown eventDate={wedding.event_date} eventTime={wedding.event_time} />
                <Location venue={wedding.venue} venueAddress={wedding.venue_address} googleMapsUrl={wedding.google_maps_url} />
                <RSVP guestName={guest.name} initialStatus={guest.rsvp_status} onSubmit={onRsvp} isDemo={isDemo} />
            </main>
        </div>
    );
}
