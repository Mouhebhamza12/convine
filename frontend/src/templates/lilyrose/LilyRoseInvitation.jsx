import { useState } from 'react';
import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import SnapJourney from '../../components/shared/SnapJourney';
import { BotanicalDefs, FloralDivider } from './Botanicals';
import PetalDrift from './PetalDrift';
import GrowingStem from './GrowingStem';
import LilyRoseOpening from './LilyRoseOpening';
import {
    LilyRoseNames,
    LilyRoseIntention,
    LilyRoseDate,
    LilyRosePhotos,
    LilyRoseLetter,
    LilyRoseCountdown,
    LilyRoseLocation,
    LilyRoseRSVP,
    LilyRoseClosing,
} from './LilyRoseScenes';
import '../../css/invitation.css';
import '../../css/lilyrose.css';

export default function LilyRoseInvitation({ data, isDemo, onRsvp }) {
    const [opened, setOpened] = useState(false);
    const { guest, wedding } = data;

    useInvitationScroll(opened);

    const bride = wedding.bride_name || 'Amina';
    const groom = wedding.groom_name || 'Yacine';

    return (
        <div className="invitation-root lilyrose-invitation">
            <BotanicalDefs />
            <div className="lr-paper" aria-hidden="true" />
            <PetalDrift />
            {opened && <GrowingStem enabled={opened} />}

            {!opened && (
                <LilyRoseOpening bride={bride} groom={groom} onComplete={() => setOpened(true)} />
            )}

            <SnapJourney enabled={opened} extraClass="lr-story" className={opened ? 'is-visible' : ''} accent="#c98f86" rsvpIndex={7}>
                <LilyRoseNames bride={bride} groom={groom} visible={opened} />
                <FloralDivider />
                <LilyRoseIntention bride={bride} groom={groom} />
                <FloralDivider />
                <LilyRoseDate eventDate={wedding.event_date} />
                <FloralDivider />
                <LilyRosePhotos photos={wedding.photos} />
                <FloralDivider />
                <LilyRoseLetter guestName={guest.name} message={wedding.message} bride={bride} groom={groom} />
                <FloralDivider />
                <LilyRoseCountdown eventDate={wedding.event_date} eventTime={wedding.event_time} />
                <FloralDivider />
                <LilyRoseLocation
                    venue={wedding.venue}
                    venueAddress={wedding.venue_address}
                    googleMapsUrl={wedding.google_maps_url}
                    eventTime={wedding.event_time}
                />
                <FloralDivider />
                <LilyRoseRSVP
                    guestName={guest.name}
                    initialStatus={guest.rsvp_status}
                    onSubmit={onRsvp}
                    isDemo={isDemo}
                />
                <LilyRoseClosing bride={bride} groom={groom} eventDate={wedding.event_date} />
            </SnapJourney>
        </div>
    );
}
