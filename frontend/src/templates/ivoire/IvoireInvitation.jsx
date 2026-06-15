import { useState } from 'react';
import IvoireOpening from './IvoireOpening';
import { IvoireHero } from './IvoireScenes';
import '../../css/invitation.css';
import '../../css/ivoire.css';

/**
 * Ivoire — embossed ivory florals & a gilded blush cameo.
 *
 * The gilded cameo cover parts to reveal the عقد قِران announcement, set into a
 * dusty-rose plaster relief. Each scene's ornament is a provided relief image;
 * all lettering is engraved type. More scenes will mount behind as the suite
 * grows.
 */
export default function IvoireInvitation({ data, isDemo }) {
    const [opened, setOpened] = useState(false);
    const { wedding } = data;
    const bride = wedding.bride_name || 'Amina';
    const groom = wedding.groom_name || 'Yacine';

    return (
        <div className="invitation-root ivoire-invitation">
            <IvoireHero bride={bride} groom={groom} eventDate={wedding.event_date} isDemo={isDemo} />
            {!opened && (
                <IvoireOpening bride={bride} groom={groom} isDemo={isDemo} onComplete={() => setOpened(true)} />
            )}
        </div>
    );
}
