import { useState } from 'react';
import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import WeddingTime from '../../components/invitation/WeddingTime';
import Countdown from '../../components/invitation/Countdown';
import Location from '../../components/invitation/Location';
import RSVP from '../../components/invitation/RSVP';
import BloomOpening from './BloomOpening';
import { BloomNames, BloomDate, BloomLetter, BloomPhotos } from './BloomScenes';
import { LeafDivider } from './BloomBotanicals';
import FallingPetals from '../../components/invitation/FallingPetals';
import '../../css/invitation.css';
import '../../css/bloom.css';

export default function BloomInvitation({ data, isDemo, onRsvp }) {
    const [opened, setOpened] = useState(false);
    const { guest, wedding } = data;

    useInvitationScroll(opened);

    const bride = wedding.bride_name || 'Amina';
    const groom = wedding.groom_name || 'Yacine';

    return (
        <div className="invitation-root bloom-invitation">
            <FallingPetals count={25} />
            {!opened && <BloomOpening onComplete={() => setOpened(true)} />}
            <main className={`invitation-story${opened ? ' is-visible' : ''}`}>
                <BloomNames bride={bride} groom={groom} visible={opened} />
                <LeafDivider className="bloom-section-divider" />
                <BloomDate eventDate={wedding.event_date} />
                <LeafDivider className="bloom-section-divider" />
                <WeddingTime eventTime={wedding.event_time} />
                <LeafDivider className="bloom-section-divider" />
                <BloomLetter guestName={guest.name} bride={bride} groom={groom} message={wedding.message} />
                <LeafDivider className="bloom-section-divider" />
                <BloomPhotos photos={wedding.photos} />
                <LeafDivider className="bloom-section-divider" />
                <Countdown eventDate={wedding.event_date} eventTime={wedding.event_time} />
                <LeafDivider className="bloom-section-divider" />
                <Location venue={wedding.venue} venueAddress={wedding.venue_address} googleMapsUrl={wedding.google_maps_url} />
                <LeafDivider className="bloom-section-divider" />
                <RSVP guestName={guest.name} initialStatus={guest.rsvp_status} onSubmit={onRsvp} isDemo={isDemo} />
            </main>
        </div>
    );
}
