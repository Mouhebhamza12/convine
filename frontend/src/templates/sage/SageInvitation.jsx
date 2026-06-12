import { useState } from 'react';
import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import SnapJourney from '../../components/shared/SnapJourney';
import SageOpening from './SageOpening';
import { SageDetails, SageLetter, SagePhotos } from './SageScenes';
import { SageTime, SageCountdown, SageLocation, SageRsvp } from './SageSections';
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
            <SnapJourney enabled={opened} className={opened ? 'is-visible' : ''} accent="#6f7d50" rsvpIndex={6}>
                <SageDetails
                    bride={bride}
                    groom={groom}
                    eventDate={wedding.event_date}
                    eventTime={wedding.event_time}
                    venue={wedding.venue}
                    venueAddress={wedding.venue_address}
                />
                <SageTime eventTime={wedding.event_time} />
                <SageLetter guestName={guest.name} bride={bride} groom={groom} message={wedding.message} />
                <SagePhotos photos={wedding.photos} />
                <SageCountdown eventDate={wedding.event_date} eventTime={wedding.event_time} />
                <SageLocation venue={wedding.venue} venueAddress={wedding.venue_address} googleMapsUrl={wedding.google_maps_url} />
                <SageRsvp guestName={guest.name} initialStatus={guest.rsvp_status} onSubmit={onRsvp} isDemo={isDemo} />
            </SnapJourney>
        </div>
    );
}
