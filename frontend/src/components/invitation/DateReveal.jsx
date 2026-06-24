import { CalendarDays } from 'lucide-react';
import StationeryCard from '../shared/StationeryCard';
import DateScratchReveal from '../shared/DateScratchReveal';

export default function DateReveal({ eventDate, visible, strings }) {
    const S = strings.date;
    return (
        <section className="invite-scene date-scene velvet-section">
            <StationeryCard>
                <DateScratchReveal
                    eventDate={eventDate}
                    visible={visible}
                    theme="velvet"
                    shape="circle"
                    locale={strings.code}
                    sceneClass="date-scratch-scene"
                    titleClass="sc-eyebrow"
                    rowClass="scratch-date-row date-coins-row"
                    hintClass="sc-hint"
                    title={S.title}
                    hintScratch={S.hintScratch}
                    hintDone={S.hintDone}
                    showLabel={false}
                    CoinIcon={CalendarDays}
                />
            </StationeryCard>
        </section>
    );
}
