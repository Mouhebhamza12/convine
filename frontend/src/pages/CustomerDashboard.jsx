import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const MAX_PHOTOS = 4;
const AUTOSAVE_MS = 1100; // wait this long after the last keystroke before saving

const INPUT_CLS =
    'w-full rounded-xl border border-[#e0d5c5] bg-[#fffdfa] px-4 py-3.5 text-base text-[#2c2419] outline-none transition focus:border-[#8b5a3c] focus:ring-2 focus:ring-[#8b5a3c]/15 placeholder:text-[#b3a594]';

function inviteLink(token) {
    return token ? `${window.location.origin}/invite/${token}` : null;
}

/* Only send a maps URL once it actually looks like one — otherwise a half-typed
   link would make every autosave fail validation and flash an error. */
function isSendableUrl(value) {
    return value === '' || /^https?:\/\/.+/i.test(value);
}

/* ─── tiny inline icons (stroked, currentColor) ─── */
const ic = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const HeartIcon = () => (<svg {...ic}><path d="M12 20s-7-4.35-9.5-8.5C1 8.5 2.5 5.5 5.5 5.5 7.5 5.5 9 7 12 9.5 15 7 16.5 5.5 18.5 5.5c3 0 4.5 3 3 6C19 15.65 12 20 12 20Z" /></svg>);
const CalIcon = () => (<svg {...ic}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></svg>);
const PinIcon = () => (<svg {...ic}><path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Z" /><circle cx="12" cy="11" r="2.2" /></svg>);
const PenIcon = () => (<svg {...ic}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>);
const CamIcon = () => (<svg {...ic}><path d="M3 8h3l1.5-2h9L18 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" /><circle cx="12" cy="13" r="3.2" /></svg>);
const UsersIcon = () => (<svg {...ic}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" /><path d="M16 4.5a3 3 0 0 1 0 6M17 15c2.4.5 4 2.4 4 5" /></svg>);
const CheckIcon = () => (<svg {...ic} width="16" height="16"><path d="M20 6 9 17l-5-5" /></svg>);
const EyeIcon = () => (<svg {...ic} width="16" height="16"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="2.6" /></svg>);
const CopyIcon = () => (<svg {...ic} width="15" height="15"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></svg>);
const ShareIcon = () => (<svg {...ic} width="15" height="15"><path d="M12 3v12" /><path d="m8 7 4-4 4 4" /><path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" /></svg>);

function Spinner() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="animate-spin">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

function SaveStatus({ state }) {
    if (state === 'saving') return <span className="flex items-center gap-2 text-sm text-[#8a7b6a]"><Spinner /> Saving…</span>;
    if (state === 'error') return <span className="text-sm font-medium text-[#a23a3a]">Couldn’t save — tap Save</span>;
    if (state === 'unsaved') return <span className="text-sm text-[#8a7b6a]">Editing… changes save automatically</span>;
    return <span className="flex items-center gap-1.5 text-sm font-medium text-[#0f7a44]"><CheckIcon /> All changes saved</span>;
}

function SectionCard({ icon, title, hint, children }) {
    return (
        <section className="rounded-2xl border border-[#ece3d6] bg-white p-5 shadow-[0_1px_3px_rgba(44,36,25,0.04)] sm:p-6">
            <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f6efe6] text-[#8b5a3c]">{icon}</span>
                <div className="min-w-0">
                    <h2 className="text-lg font-semibold leading-snug text-[#2c2419]">{title}</h2>
                    {hint ? <p className="mt-0.5 text-sm leading-relaxed text-[#8a7b6a]">{hint}</p> : null}
                </div>
            </div>
            <div className="mt-5 space-y-4">{children}</div>
        </section>
    );
}

function Field({ label, children }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#5c4d3d]">{label}</span>
            {children}
        </label>
    );
}

export default function CustomerDashboard() {
    const { user, logout } = useAuth();
    const [wedding, setWedding] = useState(null);
    const [guestText, setGuestText] = useState('');
    const [photoFiles, setPhotoFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saveState, setSaveState] = useState('idle'); // idle | unsaved | saving | saved | error
    const [guestSaving, setGuestSaving] = useState(false);
    const [guestMsg, setGuestMsg] = useState('');
    const [loadError, setLoadError] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    // Refs so the debounced saver always reads the freshest values.
    const weddingRef = useRef(null);
    const photoFilesRef = useRef([]);
    const savingRef = useRef(false);
    const pendingRef = useRef(false);
    const timerRef = useRef(null);

    useEffect(() => { weddingRef.current = wedding; }, [wedding]);
    useEffect(() => { photoFilesRef.current = photoFiles; }, [photoFiles]);

    useEffect(() => {
        api.getWedding()
            .then((data) => {
                setWedding(data.wedding);
                setGuestText(data.wedding.guests.map((g) => g.name).join('\n'));
                setSaveState('saved');
            })
            .catch((err) => setLoadError(err.message))
            .finally(() => setLoading(false));
        return () => clearTimeout(timerRef.current);
    }, []);

    const existingPhotos = useMemo(
        () => (wedding?.photos ?? []).filter((p) => typeof p === 'string' && p.trim()),
        [wedding],
    );
    const totalPhotos = existingPhotos.length + photoFiles.length;

    const newPreviews = useMemo(() => photoFiles.map((file) => URL.createObjectURL(file)), [photoFiles]);
    useEffect(() => () => newPreviews.forEach((url) => URL.revokeObjectURL(url)), [newPreviews]);

    const guests = wedding?.guests ?? [];
    const counts = {
        accepted: guests.filter((g) => g.rsvp_status === 'attending').length,
        refused: guests.filter((g) => g.rsvp_status === 'declined').length,
        pending: guests.filter((g) => !g.rsvp_status).length,
    };

    /* ─── autosave engine ─── */
    const doSave = useCallback(async () => {
        const w = weddingRef.current;
        if (!w) return;
        if (savingRef.current) { pendingRef.current = true; return; }

        savingRef.current = true;
        setSaveState('saving');

        const existing = (w.photos ?? []).filter((p) => typeof p === 'string' && p.trim());
        const files = photoFilesRef.current;

        const fd = new FormData();
        fd.append('bride_name', w.bride_name ?? '');
        fd.append('groom_name', w.groom_name ?? '');
        fd.append('event_date', w.event_date ?? '');
        fd.append('event_time', w.event_time ?? '');
        fd.append('venue', w.venue ?? '');
        fd.append('venue_address', w.venue_address ?? '');
        fd.append('message', w.message ?? '');
        if (isSendableUrl(w.google_maps_url ?? '')) {
            fd.append('google_maps_url', w.google_maps_url ?? '');
        }
        existing.forEach((p) => fd.append('photos[]', p));
        files.slice(0, Math.max(0, MAX_PHOTOS - existing.length)).forEach((f) => fd.append('photos[]', f));

        try {
            const data = await api.updateWedding(fd);
            // Only adopt the server's photo list (files → URLs); never clobber
            // text the customer may have kept typing while this save was in flight.
            setWedding((cur) => ({ ...cur, photos: data.wedding.photos }));
            setPhotoFiles([]);
            setSaveState('saved');
        } catch (err) {
            setLoadError(err.message);
            setSaveState('error');
        } finally {
            savingRef.current = false;
            if (pendingRef.current) { pendingRef.current = false; doSave(); }
        }
    }, []);

    const scheduleSave = useCallback((delay = AUTOSAVE_MS) => {
        setSaveState('unsaved');
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => doSave(), delay);
    }, [doSave]);

    const saveNow = useCallback(() => {
        clearTimeout(timerRef.current);
        doSave();
    }, [doSave]);

    function updateField(field, value) {
        setWedding((cur) => ({ ...cur, [field]: value }));
        scheduleSave();
    }

    function onAddPhotos(event) {
        const files = Array.from(event.target.files ?? []);
        const room = MAX_PHOTOS - existingPhotos.length - photoFiles.length;
        if (room > 0 && files.length) {
            setPhotoFiles((prev) => [...prev, ...files.slice(0, room)]);
            scheduleSave(400);
        }
        event.target.value = '';
    }

    function removeExistingPhoto(url) {
        setWedding((cur) => ({ ...cur, photos: (cur.photos ?? []).filter((p) => p !== url) }));
        scheduleSave(400);
    }

    function removeNewPhoto(index) {
        setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
        scheduleSave(400);
    }

    async function saveGuests(event) {
        event.preventDefault();
        setGuestSaving(true);
        setGuestMsg('');
        const names = guestText.split('\n').map((l) => l.trim()).filter(Boolean);
        try {
            const data = await api.syncGuests(names);
            setWedding((cur) => ({ ...cur, guests: data.guests }));
            setGuestText(data.guests.map((g) => g.name).join('\n'));
            setGuestMsg(`${data.guests.length} guest ${data.guests.length === 1 ? 'link' : 'links'} ready to share.`);
        } catch (err) {
            setGuestMsg(err.message);
        } finally {
            setGuestSaving(false);
        }
    }

    async function copyLink(link, id) {
        try {
            await navigator.clipboard.writeText(link);
            setCopiedId(id);
            setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1600);
        } catch {
            /* clipboard blocked — ignore */
        }
    }

    // Native share sheet (WhatsApp, Messages, …) on phones; WhatsApp web as a
    // desktop fallback so a link can always be sent in one tap.
    async function shareLink(guest, link) {
        const couple = [wedding?.bride_name, wedding?.groom_name].filter(Boolean).join(' & ');
        const text = couple ? `${couple} — you’re invited! 💌` : 'You’re invited! 💌';
        if (navigator.share) {
            try {
                await navigator.share({ title: couple || 'Wedding invitation', text, url: link });
            } catch {
                /* user dismissed the share sheet */
            }
            return;
        }
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${link}`)}`, '_blank', 'noopener');
    }

    if (loading) {
        return (
            <div className="flex min-h-svh items-center justify-center bg-[#faf7f2] text-[#6b5d4d]">
                <p>Loading your invitation…</p>
            </div>
        );
    }

    if (loadError && !wedding) {
        return (
            <div className="flex min-h-svh items-center justify-center bg-[#faf7f2] px-6 text-center">
                <p className="text-[#a23a3a]">{loadError}</p>
            </div>
        );
    }

    return (
        <div className="min-h-svh bg-[#faf7f2] pb-28 text-[#2c2419]">
            {/* ── Sticky header ── */}
            <header className="sticky top-0 z-30 border-b border-[#ece3d6] bg-[#faf7f2]/90 backdrop-blur">
                <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3 sm:px-6">
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold leading-tight sm:text-base">{wedding.title}</p>
                        <p className="text-xs text-[#8a7b6a]">Your wedding invitation</p>
                    </div>
                    <Link
                        to="/invite/demo"
                        target="_blank"
                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#dcc9b4] px-3 text-sm font-medium text-[#6b4a34] transition hover:bg-[#f6efe6]"
                    >
                        <EyeIcon /> <span>Preview</span>
                    </Link>
                    <button
                        onClick={logout}
                        className="inline-flex h-9 items-center rounded-full px-3 text-sm font-medium text-[#8a7b6a] transition hover:bg-[#f0e8dc] hover:text-[#5c4d3d]"
                    >
                        Log out
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-2xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
                <div>
                    <h1 className="font-serif text-3xl font-normal sm:text-4xl">Your invitation</h1>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-[#6b5d4d]">
                        Fill in the details below — everything saves on its own as you go.
                    </p>
                </div>

                <SectionCard icon={<HeartIcon />} title="The couple" hint="The two names your guests will see first.">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Bride">
                            <input className={INPUT_CLS} value={wedding.bride_name ?? ''} onChange={(e) => updateField('bride_name', e.target.value)} placeholder="Amina" />
                        </Field>
                        <Field label="Groom">
                            <input className={INPUT_CLS} value={wedding.groom_name ?? ''} onChange={(e) => updateField('groom_name', e.target.value)} placeholder="Yacine" />
                        </Field>
                    </div>
                </SectionCard>

                <SectionCard icon={<CalIcon />} title="Date & time" hint="When the celebration begins.">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Date">
                            <input type="date" className={INPUT_CLS} value={wedding.event_date ?? ''} onChange={(e) => updateField('event_date', e.target.value)} />
                        </Field>
                        <Field label="Time">
                            <input type="time" className={INPUT_CLS} value={wedding.event_time ?? ''} onChange={(e) => updateField('event_time', e.target.value)} />
                        </Field>
                    </div>
                </SectionCard>

                <SectionCard icon={<PinIcon />} title="Location" hint="Where to celebrate, and how to get there.">
                    <Field label="Venue name">
                        <input className={INPUT_CLS} value={wedding.venue ?? ''} onChange={(e) => updateField('venue', e.target.value)} placeholder="Le Jardin des Roses" />
                    </Field>
                    <Field label="Venue address">
                        <input className={INPUT_CLS} value={wedding.venue_address ?? ''} onChange={(e) => updateField('venue_address', e.target.value)} placeholder="12 Avenue des Roses, Paris" />
                    </Field>
                    <Field label="Google Maps link">
                        <input className={INPUT_CLS} inputMode="url" value={wedding.google_maps_url ?? ''} onChange={(e) => updateField('google_maps_url', e.target.value)} placeholder="https://maps.google.com/…" />
                    </Field>
                </SectionCard>

                <SectionCard icon={<PenIcon />} title="Your message" hint="A few warm words to open the invitation.">
                    <textarea
                        className={`${INPUT_CLS} min-h-32 resize-y leading-relaxed`}
                        value={wedding.message ?? ''}
                        onChange={(e) => updateField('message', e.target.value)}
                        placeholder="We would be honoured to have you celebrate our wedding with us…"
                    />
                </SectionCard>

                <SectionCard
                    icon={<CamIcon />}
                    title={<>Photos <span className="ml-1 text-sm font-normal text-[#8a7b6a]">{totalPhotos}/{MAX_PHOTOS}</span></>}
                    hint="Add up to 4 of your own pictures — or none at all. They join your invitation’s photo story."
                >
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                        {existingPhotos.map((url) => (
                            <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-[#ece3d6]">
                                <img src={url} alt="Wedding" className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeExistingPhoto(url)}
                                    aria-label="Remove photo"
                                    className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        {newPreviews.map((url, i) => (
                            <div key={url} className="relative aspect-square overflow-hidden rounded-xl border border-dashed border-[#c9b79c]">
                                <img src={url} alt="New upload" className="h-full w-full object-cover" />
                                <span className="absolute left-1.5 top-1.5 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">New</span>
                                <button
                                    type="button"
                                    onClick={() => removeNewPhoto(i)}
                                    aria-label="Remove photo"
                                    className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/55 text-white transition hover:bg-black/75"
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        {totalPhotos < MAX_PHOTOS ? (
                            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#c9b79c] text-[#8a7b6a] transition hover:border-[#8b5a3c] hover:bg-[#fbf6ef] hover:text-[#6b4a34]">
                                <span className="text-2xl leading-none">+</span>
                                <span className="text-xs font-medium">Add photo</span>
                                <input type="file" accept="image/*" multiple className="hidden" onChange={onAddPhotos} />
                            </label>
                        ) : null}
                    </div>
                </SectionCard>

                {/* ── Guests & RSVPs ── */}
                <SectionCard icon={<UsersIcon />} title="Guests & RSVPs" hint="One name per line. Each guest gets their own private link.">
                    <div className="grid grid-cols-3 gap-2.5">
                        <div className="rounded-xl border border-[#ece3d6] bg-[#fbfaf7] p-3 text-center">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-[#8a7b6a]">Accepted</p>
                            <p className="mt-1 text-2xl font-semibold text-[#0f7a44]">{counts.accepted}</p>
                        </div>
                        <div className="rounded-xl border border-[#ece3d6] bg-[#fbfaf7] p-3 text-center">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-[#8a7b6a]">Refused</p>
                            <p className="mt-1 text-2xl font-semibold text-[#8a2e2e]">{counts.refused}</p>
                        </div>
                        <div className="rounded-xl border border-[#ece3d6] bg-[#fbfaf7] p-3 text-center">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-[#8a7b6a]">Awaiting</p>
                            <p className="mt-1 text-2xl font-semibold text-[#6b5d4d]">{counts.pending}</p>
                        </div>
                    </div>

                    <form className="space-y-3" onSubmit={saveGuests}>
                        <textarea
                            className={`${INPUT_CLS} min-h-40 font-mono text-sm`}
                            value={guestText}
                            onChange={(e) => setGuestText(e.target.value)}
                            placeholder={'Mohamed\nFatima\nKarim\nNadia'}
                        />
                        <button className="auth-button auth-button-fill w-full sm:w-auto" type="submit" disabled={guestSaving}>
                            {guestSaving ? 'Saving guests…' : 'Save guest list & generate links'}
                        </button>
                        {guestMsg ? <p className="text-sm text-[#0065c8]">{guestMsg}</p> : null}
                    </form>

                    {guests.length ? (
                        <div className="border-t border-[#ece3d6] pt-4">
                            <h3 className="text-sm font-semibold text-[#5c4d3d]">Guest links & responses</h3>
                            <ul className="mt-3 space-y-2.5">
                                {guests.map((guest) => {
                                    const link = inviteLink(guest.token);
                                    const raw = guest.rsvp_status;
                                    const badge = raw === 'attending'
                                        ? { label: 'Accepted', cls: 'bg-[#e8f5ee] text-[#0f7a44] border-[#bfe3cf]' }
                                        : raw === 'declined'
                                            ? { label: 'Refused', cls: 'bg-[#fbeaea] text-[#8a2e2e] border-[#eccaca]' }
                                            : { label: 'Awaiting', cls: 'bg-black/[0.04] text-black/45 border-black/10' };
                                    return (
                                        <li key={guest.id} className="rounded-xl border border-[#ece3d6] bg-[#fbfaf7] p-3.5">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="min-w-0 truncate font-medium">{guest.name}</p>
                                                <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}>{badge.label}</span>
                                            </div>
                                            {link ? (
                                                <div className="mt-2 space-y-2">
                                                    <a className="block truncate text-sm text-[#0065c8] hover:underline" href={link} target="_blank" rel="noreferrer">{link}</a>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => shareLink(guest, link)}
                                                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#8b5a3c] bg-[#8b5a3c] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#76492f]"
                                                        >
                                                            <ShareIcon /> Share
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => copyLink(link, guest.id)}
                                                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#dcc9b4] px-3 py-2 text-xs font-medium text-[#6b4a34] transition hover:bg-[#f6efe6]"
                                                        >
                                                            {copiedId === guest.id ? <><CheckIcon /> Copied</> : <><CopyIcon /> Copy</>}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="mt-1 text-sm text-[#8a7b6a]">Re-save guests to generate this link.</p>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : null}
                </SectionCard>
            </main>

            {/* ── Sticky save bar (autosave status + explicit Save) ── */}
            <div
                className="fixed inset-x-0 bottom-0 z-30 border-t border-[#ece3d6] bg-[#faf7f2]/95 backdrop-blur"
                style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }}
            >
                <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
                    <SaveStatus state={saveState} />
                    <button
                        className="auth-button auth-button-fill px-7 disabled:opacity-60"
                        onClick={saveNow}
                        disabled={saveState === 'saving'}
                    >
                        {saveState === 'saving' ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}
