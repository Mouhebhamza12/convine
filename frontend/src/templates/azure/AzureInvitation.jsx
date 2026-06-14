import { useState } from 'react';
import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import SnapJourney from '../../components/shared/SnapJourney';
import AzureEnvelope from './AzureEnvelope';
import { AzureHero, AzureLetter, AzurePhotos } from './AzureScenes';
import { AzureTime, AzureCountdown, AzureLocation, AzureRsvp } from './AzureSections';
import '../../css/invitation.css';
import '../../css/azure.css';

export default function AzureInvitation({ data, isDemo, onRsvp }) {
    const [opened, setOpened] = useState(false);
    const [revealing, setRevealing] = useState(false);
    const { guest, wedding } = data;

    useInvitationScroll(opened);

    const bride = wedding.bride_name || 'Amina';
    const groom = wedding.groom_name || 'Yacine';

    return (
        <div className="invitation-root azure-invitation">
            {!opened && (
                <AzureEnvelope
                    onStart={() => setRevealing(true)}
                    onComplete={() => setOpened(true)}
                />
            )}
            <SnapJourney enabled={opened} className={revealing ? 'is-visible' : ''} accent="#2e5e9e" rsvpIndex={6}>
                <AzureHero
                    bride={bride}
                    groom={groom}
                    eventDate={wedding.event_date}
                    eventTime={wedding.event_time}
                    venue={wedding.venue}
                    rsvpPhone={wedding.rsvp_phone}
                />
                <AzureTime eventTime={wedding.event_time} eventDate={wedding.event_date} bride={bride} groom={groom} />
                <AzureLetter guestName={guest.name} bride={bride} groom={groom} message={wedding.message} />
                <AzureCountdown eventDate={wedding.event_date} eventTime={wedding.event_time} />
                <AzureLocation venue={wedding.venue} venueAddress={wedding.venue_address} googleMapsUrl={wedding.google_maps_url} />
                <AzurePhotos photos={wedding.photos} />
                <AzureRsvp guestName={guest.name} initialStatus={guest.rsvp_status} onSubmit={onRsvp} isDemo={isDemo} />
            </SnapJourney>
        </div>
    );
}
