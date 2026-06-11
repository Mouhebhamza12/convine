import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import { AzureHero, AzureLetter, AzurePhotos } from './AzureScenes';
import { AzureTime, AzureCountdown, AzureLocation, AzureRsvp } from './AzureSections';
import '../../css/invitation.css';
import '../../css/azure.css';

export default function AzureInvitation({ data, isDemo, onRsvp }) {
    const { guest, wedding } = data;

    // No tap-to-open cover for Azure — the invitation is shown immediately.
    useInvitationScroll(true);

    const bride = wedding.bride_name || 'Amina';
    const groom = wedding.groom_name || 'Yacine';

    return (
        <div className="invitation-root azure-invitation">
            <main className="invitation-story is-visible">
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
            </main>
        </div>
    );
}
