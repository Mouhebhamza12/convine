import { useState } from 'react';
import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import GoldDust from './GoldDust';
import ThreadSpine from './ThreadSpine';
import FiligreeOpening from './FiligreeOpening';
import {
    ThreadStitch,
    FiligreeNames,
    FiligreeWords,
    FiligreeDate,
    FiligreePhotos,
    FiligreeLetter,
    FiligreeCountdown,
    FiligreeCeremony,
    FiligreeKnot,
    FiligreeRSVP,
    FiligreeClosing,
} from './FiligreeScenes';
import '../../css/invitation.css';
import '../../css/filigree.css';

export default function FiligreeInvitation({ data, isDemo, onRsvp }) {
    const [opened, setOpened] = useState(false);
    const { guest, wedding } = data;

    useInvitationScroll(opened);

    const bride = wedding.bride_name || 'Amina';
    const groom = wedding.groom_name || 'Yacine';

    return (
        <div className="invitation-root filigree-invitation">
            <GoldDust />
            {opened && <ThreadSpine enabled={opened} />}

            {!opened && (
                <FiligreeOpening bride={bride} groom={groom} onComplete={() => setOpened(true)} />
            )}

            <main className={`invitation-story filigree-story${opened ? ' is-visible' : ''}`}>
                <FiligreeNames bride={bride} groom={groom} />
                <ThreadStitch />
                <FiligreeWords text="Every great love is woven slowly — one quiet thread at a time." />
                <ThreadStitch />
                <FiligreeDate eventDate={wedding.event_date} />
                <ThreadStitch />
                <FiligreePhotos photos={wedding.photos} />
                <ThreadStitch />
                <FiligreeLetter guestName={guest.name} message={wedding.message} bride={bride} groom={groom} />
                <ThreadStitch />
                <FiligreeCountdown eventDate={wedding.event_date} eventTime={wedding.event_time} />
                <ThreadStitch />
                <FiligreeCeremony
                    eventTime={wedding.event_time}
                    eventDate={wedding.event_date}
                    venue={wedding.venue}
                    venueAddress={wedding.venue_address}
                    googleMapsUrl={wedding.google_maps_url}
                    brideName={bride}
                    groomName={groom}
                />
                <ThreadStitch />
                <FiligreeKnot bride={bride} groom={groom} eventDate={wedding.event_date} />
                <ThreadStitch />
                <FiligreeRSVP
                    guestName={guest.name}
                    initialStatus={guest.rsvp_status}
                    onSubmit={onRsvp}
                    isDemo={isDemo}
                />
                <FiligreeClosing bride={bride} groom={groom} />
            </main>
        </div>
    );
}
