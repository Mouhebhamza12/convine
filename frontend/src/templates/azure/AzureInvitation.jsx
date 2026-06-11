import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import WeddingTime from '../../components/invitation/WeddingTime';
import Countdown from '../../components/invitation/Countdown';
import Location from '../../components/invitation/Location';
import RSVP from '../../components/invitation/RSVP';
import { AzureHero, AzureLetter, AzurePhotos } from './AzureScenes';
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
                <RSVP guestName={guest.name} initialStatus={guest.rsvp_status} onSubmit={onRsvp} isDemo={isDemo} />
                <WeddingTime eventTime={wedding.event_time} />
                <AzureLetter guestName={guest.name} bride={bride} groom={groom} message={wedding.message} />
                <Countdown eventDate={wedding.event_date} eventTime={wedding.event_time} />
                <Location venue={wedding.venue} venueAddress={wedding.venue_address} googleMapsUrl={wedding.google_maps_url} />
                <AzurePhotos photos={wedding.photos} />
            </main>
        </div>
    );
}
