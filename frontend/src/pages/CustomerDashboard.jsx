import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const MAX_PHOTOS = 4;

function inviteLink(token) {
    if (!token) {
        return null;
    }

    return `${window.location.origin}/invite/${token}`;
}

/* badge styling per RSVP state — so the client sees who accepted / refused at a glance */
function statusMeta(raw) {
    if (raw === 'attending') return { label: 'Accepted', cls: 'bg-[#e8f5ee] text-[#0f7a44] border-[#bfe3cf]' };
    if (raw === 'declined') return { label: 'Refused', cls: 'bg-[#fbeaea] text-[#8a2e2e] border-[#eccaca]' };
    return { label: 'Awaiting', cls: 'bg-black/[0.04] text-black/45 border-black/10' };
}

export default function CustomerDashboard() {
    const { user, logout } = useAuth();
    const [wedding, setWedding] = useState(null);
    const [guestText, setGuestText] = useState('');
    const [photoFiles, setPhotoFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [guestSaving, setGuestSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        api.getWedding()
            .then((data) => {
                setWedding(data.wedding);
                setGuestText(data.wedding.guests.map((guest) => guest.name).join('\n'));
                setPhotoFiles([]);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const existingPhotos = useMemo(
        () => (wedding?.photos ?? []).filter((p) => typeof p === 'string' && p.trim()),
        [wedding],
    );
    const totalPhotos = existingPhotos.length + photoFiles.length;

    // Object-URL previews for freshly picked files, revoked when they change.
    const newPreviews = useMemo(() => photoFiles.map((file) => URL.createObjectURL(file)), [photoFiles]);
    useEffect(() => () => newPreviews.forEach((url) => URL.revokeObjectURL(url)), [newPreviews]);

    const guests = wedding?.guests ?? [];
    const counts = {
        accepted: guests.filter((g) => g.rsvp_status === 'attending').length,
        refused: guests.filter((g) => g.rsvp_status === 'declined').length,
        pending: guests.filter((g) => !g.rsvp_status).length,
    };

    function onAddPhotos(event) {
        const files = Array.from(event.target.files ?? []);
        const room = MAX_PHOTOS - existingPhotos.length - photoFiles.length;
        if (room > 0 && files.length) {
            setPhotoFiles((prev) => [...prev, ...files.slice(0, room)]);
        }
        event.target.value = ''; // allow re-picking the same file later
    }

    function removeExistingPhoto(url) {
        setWedding((current) => ({
            ...current,
            photos: (current.photos ?? []).filter((p) => p !== url),
        }));
    }

    function removeNewPhoto(index) {
        setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    }

    async function saveWedding(event) {
        event.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        const formData = new FormData();
        formData.append('bride_name', wedding.bride_name ?? '');
        formData.append('groom_name', wedding.groom_name ?? '');
        formData.append('event_date', wedding.event_date ?? '');
        formData.append('event_time', wedding.event_time ?? '');
        formData.append('venue', wedding.venue ?? '');
        formData.append('venue_address', wedding.venue_address ?? '');
        formData.append('google_maps_url', wedding.google_maps_url ?? '');
        formData.append('message', wedding.message ?? '');

        // kept existing photos (URLs) first…
        existingPhotos.forEach((photo) => formData.append('photos[]', photo));
        // …then any newly added files, never exceeding the 0–4 cap.
        photoFiles.slice(0, Math.max(0, MAX_PHOTOS - existingPhotos.length)).forEach((file) => {
            formData.append('photos[]', file);
        });

        try {
            const data = await api.updateWedding(formData);
            setWedding(data.wedding);
            setPhotoFiles([]);
            setMessage('Invitation details saved.');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function saveGuests(event) {
        event.preventDefault();
        setGuestSaving(true);
        setMessage('');
        setError('');

        const names = guestText
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);

        try {
            const data = await api.syncGuests(names);
            setWedding((current) => ({ ...current, guests: data.guests }));
            setGuestText(data.guests.map((guest) => guest.name).join('\n'));
            setMessage(`${data.guests.length} guest links ready. Share each personalized link via WhatsApp.`);
        } catch (err) {
            setError(err.message);
        } finally {
            setGuestSaving(false);
        }
    }

    function updateWeddingField(field, value) {
        setWedding((current) => ({ ...current, [field]: value }));
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-black">
                <p className="text-[#6b5d4d]">Loading...</p>
            </div>
        );
    }

    if (error && !wedding) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white px-6 text-black">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5] text-black">
            <header className="border-b border-black/10 bg-white px-6 py-5">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-normal">{wedding.title}</h1>
                        <p className="mt-1 text-sm text-black/50">Manage your cinematic wedding invitation</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link className="auth-button auth-button-outline text-sm" to="/invite/demo" target="_blank">
                            Preview demo
                        </Link>
                        <span className="hidden text-sm text-black/60 sm:inline">{user.email}</span>
                        <button className="auth-button auth-button-outline" onClick={logout}>
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto grid max-w-5xl gap-8 px-6 py-10 lg:grid-cols-2">
                <section className="border border-black/10 bg-white p-6">
                    <h2 className="text-2xl font-normal">Invitation details</h2>
                    <p className="mt-2 text-sm text-black/60">
                        These details power the guest experience — opening, names, date reveal, letter, and more.
                    </p>

                    <form className="mt-6 space-y-4" onSubmit={saveWedding}>
                        <label className="block">
                            <span className="form-label">Bride</span>
                            <input
                                className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                value={wedding.bride_name ?? ''}
                                onChange={(e) => updateWeddingField('bride_name', e.target.value)}
                            />
                        </label>

                        <label className="block">
                            <span className="form-label">Groom</span>
                            <input
                                className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                value={wedding.groom_name ?? ''}
                                onChange={(e) => updateWeddingField('groom_name', e.target.value)}
                            />
                        </label>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block">
                                <span className="form-label">Date</span>
                                <input
                                    className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                    type="date"
                                    value={wedding.event_date ?? ''}
                                    onChange={(e) => updateWeddingField('event_date', e.target.value)}
                                />
                            </label>

                            <label className="block">
                                <span className="form-label">Time (24h)</span>
                                <input
                                    className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                    type="time"
                                    value={wedding.event_time ?? ''}
                                    onChange={(e) => updateWeddingField('event_time', e.target.value)}
                                />
                            </label>
                        </div>

                        <label className="block">
                            <span className="form-label">Venue name</span>
                            <input
                                className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                value={wedding.venue ?? ''}
                                onChange={(e) => updateWeddingField('venue', e.target.value)}
                            />
                        </label>

                        <label className="block">
                            <span className="form-label">Venue address</span>
                            <input
                                className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                value={wedding.venue_address ?? ''}
                                onChange={(e) => updateWeddingField('venue_address', e.target.value)}
                                placeholder="12 Avenue des Roses, Paris"
                            />
                        </label>

                        <label className="block">
                            <span className="form-label">Invitation message</span>
                            <textarea
                                className="mt-2 min-h-28 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                value={wedding.message ?? ''}
                                onChange={(e) => updateWeddingField('message', e.target.value)}
                                placeholder="We are delighted to invite you to celebrate our wedding..."
                            />
                        </label>

                        {/* ─── Photos: a 0–4 manager (add & remove) ─── */}
                        <div>
                            <span className="form-label">
                                Invitation photos <span className="text-black/40">({totalPhotos}/{MAX_PHOTOS})</span>
                            </span>
                            <p className="mt-1 text-sm text-black/50">
                                Add up to 4 of your own pictures — or none. They appear in your invitation’s photo story; remove any to show fewer.
                            </p>

                            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {existingPhotos.map((url) => (
                                    <div key={url} className="relative aspect-square overflow-hidden rounded border border-black/10">
                                        <img src={url} alt="Wedding" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingPhoto(url)}
                                            aria-label="Remove photo"
                                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-sm leading-none text-white hover:bg-black/80"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}

                                {newPreviews.map((url, i) => (
                                    <div key={url} className="relative aspect-square overflow-hidden rounded border border-dashed border-black/25">
                                        <img src={url} alt="New upload" className="h-full w-full object-cover" />
                                        <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white">
                                            New
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeNewPhoto(i)}
                                            aria-label="Remove photo"
                                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-sm leading-none text-white hover:bg-black/80"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}

                                {totalPhotos < MAX_PHOTOS ? (
                                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded border border-dashed border-black/25 text-black/40 transition hover:border-black/50 hover:text-black/70">
                                        <span className="text-2xl leading-none">+</span>
                                        <span className="text-xs">Add photo</span>
                                        <input type="file" accept="image/*" multiple className="hidden" onChange={onAddPhotos} />
                                    </label>
                                ) : null}
                            </div>
                        </div>

                        <label className="block">
                            <span className="form-label">Google Maps link</span>
                            <input
                                className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                value={wedding.google_maps_url ?? ''}
                                onChange={(e) => updateWeddingField('google_maps_url', e.target.value)}
                                placeholder="https://www.google.com/maps/..."
                            />
                        </label>

                        <button className="auth-button auth-button-fill" type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save invitation'}
                        </button>
                    </form>
                </section>

                <section className="border border-black/10 bg-white p-6">
                    <h2 className="text-2xl font-normal">Guests &amp; responses</h2>
                    <p className="mt-2 text-base leading-7 text-black/60">
                        Add one name per line. Each guest gets a unique link — and you’ll see right here who accepted and who refused.
                    </p>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="border border-black/10 bg-white p-4 text-center">
                            <p className="text-xs text-black/40">Accepted</p>
                            <p className="mt-1 text-2xl font-semibold text-[#0f7a44]">{counts.accepted}</p>
                        </div>
                        <div className="border border-black/10 bg-white p-4 text-center">
                            <p className="text-xs text-black/40">Refused</p>
                            <p className="mt-1 text-2xl font-semibold text-[#8a2e2e]">{counts.refused}</p>
                        </div>
                        <div className="border border-black/10 bg-white p-4 text-center">
                            <p className="text-xs text-black/40">Awaiting</p>
                            <p className="mt-1 text-2xl font-semibold text-[#6b5d4d]">{counts.pending}</p>
                        </div>
                    </div>

                    <form className="mt-6 space-y-4" onSubmit={saveGuests}>
                        <textarea
                            className="min-h-44 w-full border border-black/15 px-4 py-3 font-mono text-sm outline-none focus:border-black"
                            value={guestText}
                            onChange={(e) => setGuestText(e.target.value)}
                            placeholder={'Mohamed\nFatima\nKarim\nNadia'}
                        />

                        <button className="auth-button auth-button-fill" type="submit" disabled={guestSaving}>
                            {guestSaving ? 'Saving guests...' : 'Save guest list'}
                        </button>
                    </form>

                    {guests.length ? (
                        <div className="mt-6 border-t border-black/10 pt-6">
                            <h3 className="text-lg font-medium">Responses &amp; links</h3>
                            <ul className="mt-3 space-y-3">
                                {guests.map((guest) => {
                                    const link = inviteLink(guest.token);
                                    const badge = statusMeta(guest.rsvp_status);

                                    return (
                                        <li key={guest.id} className="rounded border border-black/10 px-4 py-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="font-medium">{guest.name}</p>
                                                <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}>
                                                    {badge.label}
                                                </span>
                                            </div>
                                            {link ? (
                                                <a
                                                    className="mt-1 block truncate text-sm text-[#0065c8] hover:underline"
                                                    href={link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {link}
                                                </a>
                                            ) : (
                                                <p className="mt-1 text-sm text-black/50">Re-save guests to generate link</p>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : null}
                </section>
            </main>

            {message ? <p className="mx-auto max-w-5xl px-6 pb-10 text-sm text-[#0065c8]">{message}</p> : null}
            {error ? <p className="mx-auto max-w-5xl px-6 pb-10 text-sm text-red-600">{error}</p> : null}
        </div>
    );
}
