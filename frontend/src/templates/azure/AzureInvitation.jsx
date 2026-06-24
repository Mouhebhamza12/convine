import { useState } from 'react';
import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import SnapJourney from '../../components/shared/SnapJourney';
import AzureOverture from './AzureOverture';
import { AzureHero, AzureLetter, AzurePhotos } from './AzureScenes';
import { AzureTime, AzureCountdown, AzureLocation, AzureRsvp } from './AzureSections';
import { azureStrings } from './AzureStrings';
import '../../css/invitation.css';
import '../../css/azure.css';

export default function AzureInvitation({ data, isDemo, onRsvp, locale = 'en' }) {
    const [opened, setOpened] = useState(false);
    const [revealing, setRevealing] = useState(false);
    const { guest, wedding } = data;
    const strings = azureStrings(locale);

    useInvitationScroll(opened);

    const bride = wedding.bride_name || 'Amina';
    const groom = wedding.groom_name || 'Yacine';

    return (
        <div className="invitation-root azure-invitation" lang={strings.code} dir={strings.dir}>
            {!opened && (
                <AzureOverture
                    bride={bride}
                    groom={groom}
                    eventDate={wedding.event_date}
                    venue={wedding.venue}
                    onStart={() => setRevealing(true)}
                    onComplete={() => setOpened(true)}
                    strings={strings}
                />
            )}
            <SnapJourney enabled={opened} className={revealing ? 'is-visible' : ''} accent="#2e5e9e" rsvpIndex={6} rsvpLabel={strings.rsvp.cta}>
                <AzureHero
                    bride={bride}
                    groom={groom}
                    eventDate={wedding.event_date}
                    eventTime={wedding.event_time}
                    venue={wedding.venue}
                    rsvpPhone={wedding.rsvp_phone}
                    strings={strings}
                />
                <AzureTime eventTime={wedding.event_time} eventDate={wedding.event_date} bride={bride} groom={groom} strings={strings} />
                <AzureLetter guestName={guest.name} bride={bride} groom={groom} message={isDemo ? '' : wedding.message} strings={strings} />
                <AzureCountdown eventDate={wedding.event_date} eventTime={wedding.event_time} strings={strings} />
                <AzureLocation venue={wedding.venue} venueAddress={wedding.venue_address} googleMapsUrl={wedding.google_maps_url} strings={strings} />
                <AzurePhotos photos={wedding.photos} strings={strings} />
                <AzureRsvp guestName={guest.name} initialStatus={guest.rsvp_status} onSubmit={onRsvp} isDemo={isDemo} strings={strings} />
            </SnapJourney>
        </div>
    );
}
