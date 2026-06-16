import { useState } from 'react';
import { useInvitationScroll } from '../../hooks/useInvitationScroll';
import FullPageScroller from '../../components/shared/FullPageScroller';
import IvoireOpening from './IvoireOpening';
import { IvoireHero, IvoireLetter, IvoireDetails } from './IvoireScenes';
import { IVOIRE_STRINGS } from './IvoireStrings';
import '../../css/invitation.css';
import '../../css/ivoire.css';

/**
 * Ivoire — embossed ivory florals & a gilded blush cameo.
 *
 * The gilded cameo cover parts to reveal a section-per-gesture suite: the عقد
 * قِران announcement, a heartfelt letter, and the day's details. Each scene's
 * ornament is a provided relief image; all lettering is engraved type.
 */
export default function IvoireInvitation({ data, isDemo }) {
    const [opened, setOpened] = useState(false);
    const { wedding, guest } = data;
    const bride = wedding.bride_name || 'Amina';
    const groom = wedding.groom_name || 'Yacine';
    const message = isDemo ? '' : wedding.message;

    useInvitationScroll(opened);

    return (
        <div className="invitation-root ivoire-invitation">
            <FullPageScroller enabled={opened} className="ivoire-fp" rtl labels={IVOIRE_STRINGS.nav}>
                <IvoireHero bride={bride} groom={groom} eventDate={wedding.event_date} isDemo={isDemo} />
                <IvoireLetter guestName={guest.name} bride={bride} groom={groom} message={message} isDemo={isDemo} />
                <IvoireDetails eventDate={wedding.event_date} eventTime={wedding.event_time} venue={wedding.venue} venueAddress={wedding.venue_address} />
            </FullPageScroller>
            {!opened && (
                <IvoireOpening bride={bride} groom={groom} isDemo={isDemo} onComplete={() => setOpened(true)} />
            )}
        </div>
    );
}
