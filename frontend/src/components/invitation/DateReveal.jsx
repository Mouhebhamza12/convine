import { CalendarDays } from 'lucide-react';
import StationeryCard from '../shared/StationeryCard';
import DateScratchReveal from '../shared/DateScratchReveal';

export default function DateReveal({ eventDate, visible }) {
    return (
        <section className="invite-scene date-scene velvet-section">
            <StationeryCard>
                <DateScratchReveal
                    eventDate={eventDate}
                    visible={visible}
                    theme="velvet"
                    shape="circle"
                    sceneClass="date-scratch-scene"
                    titleClass="sc-eyebrow"
                    rowClass="scratch-date-row date-coins-row"
                    hintClass="sc-hint"
                    title="Our Wedding Date"
                    hintScratch="Swipe your finger to brush away the coating"
                    hintDone="Save the date in your heart"
                    showLabel={false}
                    CoinIcon={CalendarDays}
                />
            </StationeryCard>
        </section>
    );
}
