import { useState } from 'react';
import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import SnapJourney from '../../components/shared/SnapJourney';
import SageOpening from './SageOpening';
import { SageDetails, SageLetter, SagePhotos } from './SageScenes';
import { SageTime, SageCountdown, SageLocation, SageRsvp } from './SageSections';
import { sageStrings } from './SageStrings';
import '../../css/invitation.css';
import '../../css/sage.css';

export default function SageInvitation({ data, isDemo, onRsvp, locale = 'en' }) {
    const [opened, setOpened] = useState(false);
    const { guest, wedding } = data;
    const strings = sageStrings(locale);

    useInvitationScroll(opened);

    const bride = wedding.bride_name || 'Amina';
    const groom = wedding.groom_name || 'Yacine';

    return (
        <div className="invitation-root sage-invitation" lang={strings.code} dir={strings.dir}>
            {!opened && (
                <SageOpening
                    onComplete={() => setOpened(true)}
                    bride={bride}
                    groom={groom}
                    guestName={guest.name}
                    strings={strings}
                />
            )}
            <SnapJourney enabled={opened} className={opened ? 'is-visible' : ''} accent="#6f7d50" rsvpIndex={6} rsvpLabel={strings.rsvp.cta}>
                <SageDetails
                    bride={bride}
                    groom={groom}
                    eventDate={wedding.event_date}
                    eventTime={wedding.event_time}
                    venue={wedding.venue}
                    venueAddress={wedding.venue_address}
                    strings={strings}
                />
                <SageTime eventTime={wedding.event_time} strings={strings} />
                <SageLetter guestName={guest.name} bride={bride} groom={groom} message={isDemo ? '' : wedding.message} strings={strings} />
                <SagePhotos photos={wedding.photos} strings={strings} />
                <SageCountdown eventDate={wedding.event_date} eventTime={wedding.event_time} strings={strings} />
                <SageLocation venue={wedding.venue} venueAddress={wedding.venue_address} googleMapsUrl={wedding.google_maps_url} strings={strings} />
                <SageRsvp guestName={guest.name} initialStatus={guest.rsvp_status} onSubmit={onRsvp} isDemo={isDemo} strings={strings} />
            </SnapJourney>
        </div>
    );
}
