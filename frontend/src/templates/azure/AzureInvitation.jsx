import { useState } from 'react';
import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import WeddingTime from '../../components/invitation/WeddingTime';
import Countdown from '../../components/invitation/Countdown';
import Location from '../../components/invitation/Location';
import RSVP from '../../components/invitation/RSVP';
import AzureOpening from './AzureOpening';
import { AzureLetter, AzurePhotos } from './AzureScenes';
import '../../css/invitation.css';
import '../../css/azure.css';

export default function AzureInvitation({ data, isDemo, onRsvp }) {
    const [opened, setOpened] = useState(false);
    const { guest, wedding } = data;

    useInvitationScroll(opened);

    const bride = wedding.bride_name || 'Amina';
    const groom = wedding.groom_name || 'Yacine';

    return (
        <div className="invitation-root azure-invitation">
            {!opened && (
                <AzureOpening
                    onComplete={() => setOpened(true)}
                    bride={bride}
                    groom={groom}
                    eventDate={wedding.event_date}
                    eventTime={wedding.event_time}
                    venue={wedding.venue}
                    rsvpPhone={wedding.rsvp_phone}
                />
            )}
            <main className={`invitation-story${opened ? ' is-visible' : ''}`}>
                <WeddingTime eventTime={wedding.event_time} />
                <AzureLetter guestName={guest.name} bride={bride} groom={groom} message={wedding.message} />
                <AzurePhotos photos={wedding.photos} />
                <Countdown eventDate={wedding.event_date} eventTime={wedding.event_time} />
                <Location venue={wedding.venue} venueAddress={wedding.venue_address} googleMapsUrl={wedding.google_maps_url} />
                <RSVP guestName={guest.name} initialStatus={guest.rsvp_status} onSubmit={onRsvp} isDemo={isDemo} />
            </main>
        </div>
    );
}
