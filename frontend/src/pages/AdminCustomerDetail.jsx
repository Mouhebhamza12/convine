import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { WEDDING_TEMPLATES } from '../lib/templates';

function inviteLink(token) {
    return token ? `${window.location.origin}/invite/${token}` : null;
}

const EDITABLE_FIELDS = [
    'title',
    'bride_name',
    'groom_name',
    'event_date',
    'event_time',
    'venue',
    'venue_address',
    'message',
];

export default function AdminCustomerDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    function hydrate(data) {
        setCustomer(data);
        setForm({
            name: data.credentials?.name ?? '',
            title: data.title ?? '',
            bride_name: data.bride_name ?? '',
            groom_name: data.groom_name ?? '',
            event_date: data.event_date ?? '',
            event_time: data.event_time ?? '',
            venue: data.venue ?? '',
            venue_address: data.venue_address ?? '',
            message: data.message ?? '',
        });
    }

    useEffect(() => {
        api.adminCustomer(id)
            .then((data) => hydrate(data.customer))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    async function patch(payload, note = 'Saved.') {
        setSaving(true);
        setMessage('');
        setError('');

        try {
            const data = await api.updateCustomer(id, payload);
            hydrate(data.customer);
            setMessage(note);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function saveDetails(event) {
        event.preventDefault();
        const payload = { name: form.name };
        EDITABLE_FIELDS.forEach((field) => {
            payload[field] = form[field] === '' ? null : form[field];
        });
        payload.title = form.title; // title must stay non-null
        await patch(payload, 'Invitation details saved.');
    }

    async function copyLogin() {
        const { email, password } = customer.credentials;
        try {
            await navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setError('Could not copy automatically — select and copy the details manually.');
        }
    }

    async function regenerate() {
        if (!window.confirm('Generate a new password? The old one will stop working immediately.')) {
            return;
        }

        setSaving(true);
        setMessage('');
        setError('');

        try {
            const data = await api.regenerateCustomerPassword(id);
            setCustomer((current) => ({
                ...current,
                credentials: { ...current.credentials, password: data.password },
            }));
            setMessage('New password generated. Copy and send it to the customer.');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function remove() {
        if (!window.confirm('Delete this customer, their invitation, and all guests? This cannot be undone.')) {
            return;
        }

        try {
            await api.deleteCustomer(id);
            navigate('/admin');
        } catch (err) {
            setError(err.message);
        }
    }

    function updateField(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-black">
                <p className="text-[#6b5d4d]">Loading...</p>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-black">
                <p className="text-red-600">{error || 'Customer not found.'}</p>
                <Link className="auth-button auth-button-outline" to="/admin">
                    Back to customers
                </Link>
            </div>
        );
    }

    const { credentials } = customer;

    return (
        <div className="min-h-screen bg-[#f7f7f5] text-black">
            <header className="border-b border-black/10 bg-white px-6 py-5">
                <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-normal">{customer.title}</h1>
                        <p className="mt-1 text-sm text-black/50">{credentials.name}</p>
                    </div>
                    <Link className="auth-button auth-button-outline" to="/admin">
                        Back
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-6 py-10">
                {message ? <p className="mb-6 rounded border border-[#0f7a44]/30 bg-[#eaf5ee] px-4 py-3 text-sm text-[#0f7a44]">{message}</p> : null}
                {error ? <p className="mb-6 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Credentials */}
                    <section className="border border-black/10 bg-white p-6">
                        <h2 className="text-2xl font-normal">Login credentials</h2>
                        <p className="mt-2 text-sm text-black/60">Send these to the customer. The password is stored so you can re-read it anytime.</p>
                        <dl className="mt-5 space-y-3 text-base">
                            <div>
                                <dt className="text-black/50">Email</dt>
                                <dd className="font-semibold">{credentials.email}</dd>
                            </div>
                            <div>
                                <dt className="text-black/50">Password</dt>
                                <dd className="font-mono text-lg">{credentials.password ?? '—'}</dd>
                            </div>
                        </dl>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <button className="auth-button auth-button-fill" onClick={copyLogin} type="button">
                                {copied ? 'Copied!' : 'Copy login'}
                            </button>
                            <button className="auth-button auth-button-outline" onClick={regenerate} type="button" disabled={saving}>
                                Regenerate password
                            </button>
                        </div>
                    </section>

                    {/* Status & template */}
                    <section className="border border-black/10 bg-white p-6">
                        <h2 className="text-2xl font-normal">Status</h2>

                        <div className="mt-5 space-y-5">
                            <label className="block">
                                <span className="form-label">Template</span>
                                <select
                                    className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black"
                                    value={customer.template_slug}
                                    onChange={(e) => patch({ template_slug: e.target.value }, 'Template updated.')}
                                    disabled={saving}
                                >
                                    {WEDDING_TEMPLATES.map((t) => (
                                        <option key={t.slug} value={t.slug}>
                                            {t.name} — {t.tagline}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <div className="flex items-center justify-between border-t border-black/10 pt-4">
                                <div>
                                    <p className="font-medium">Published</p>
                                    <p className="text-sm text-black/50">{customer.published ? 'Guests can view the invitation.' : 'Hidden from guests (draft).'}</p>
                                </div>
                                <button
                                    className={`auth-button ${customer.published ? 'auth-button-outline' : 'auth-button-fill'}`}
                                    onClick={() => patch({ status: customer.published ? 'draft' : 'ready' }, customer.published ? 'Unpublished.' : 'Published.')}
                                    type="button"
                                    disabled={saving}
                                >
                                    {customer.published ? 'Unpublish' : 'Publish'}
                                </button>
                            </div>

                            <div className="flex items-center justify-between border-t border-black/10 pt-4">
                                <div>
                                    <p className="font-medium">Payment</p>
                                    <p className="text-sm text-black/50">{customer.paid ? `Marked paid${customer.paid_at ? ` on ${customer.paid_at.slice(0, 10)}` : ''}.` : 'Not paid yet.'}</p>
                                </div>
                                <button
                                    className={`auth-button ${customer.paid ? 'auth-button-outline' : 'auth-button-fill'}`}
                                    onClick={() => patch({ paid: !customer.paid }, customer.paid ? 'Marked unpaid.' : 'Marked paid.')}
                                    type="button"
                                    disabled={saving}
                                >
                                    {customer.paid ? 'Mark unpaid' : 'Mark paid'}
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Invitation details (owner can edit on behalf) */}
                <section className="mt-8 border border-black/10 bg-white p-6">
                    <h2 className="text-2xl font-normal">Invitation details</h2>
                    <p className="mt-2 text-sm text-black/60">The customer edits these too — change them here only if you need to.</p>

                    <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={saveDetails}>
                        <label className="block sm:col-span-2">
                            <span className="form-label">Customer name</span>
                            <input className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black" value={form.name} onChange={(e) => updateField('name', e.target.value)} />
                        </label>
                        <label className="block sm:col-span-2">
                            <span className="form-label">Wedding title</span>
                            <input className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black" value={form.title} onChange={(e) => updateField('title', e.target.value)} required />
                        </label>
                        <label className="block">
                            <span className="form-label">Bride</span>
                            <input className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black" value={form.bride_name} onChange={(e) => updateField('bride_name', e.target.value)} />
                        </label>
                        <label className="block">
                            <span className="form-label">Groom</span>
                            <input className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black" value={form.groom_name} onChange={(e) => updateField('groom_name', e.target.value)} />
                        </label>
                        <label className="block">
                            <span className="form-label">Date</span>
                            <input className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black" type="date" value={form.event_date ?? ''} onChange={(e) => updateField('event_date', e.target.value)} />
                        </label>
                        <label className="block">
                            <span className="form-label">Time</span>
                            <input className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black" type="time" value={form.event_time ?? ''} onChange={(e) => updateField('event_time', e.target.value)} />
                        </label>
                        <label className="block sm:col-span-2">
                            <span className="form-label">Venue</span>
                            <input className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black" value={form.venue} onChange={(e) => updateField('venue', e.target.value)} />
                        </label>
                        <label className="block sm:col-span-2">
                            <span className="form-label">Venue address</span>
                            <input className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black" value={form.venue_address} onChange={(e) => updateField('venue_address', e.target.value)} />
                        </label>
                        <label className="block sm:col-span-2">
                            <span className="form-label">Message</span>
                            <textarea className="mt-2 min-h-24 w-full border border-black/15 px-4 py-3 outline-none focus:border-black" value={form.message} onChange={(e) => updateField('message', e.target.value)} />
                        </label>
                        <div className="sm:col-span-2">
                            <button className="auth-button auth-button-fill" type="submit" disabled={saving}>
                                {saving ? 'Saving...' : 'Save details'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Guests & RSVPs */}
                <section className="mt-8 border border-black/10 bg-white p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-normal">Guests &amp; RSVPs</h2>
                        <p className="text-sm text-black/50">
                            {customer.accepted_count} accepted · {customer.refused_count} refused · {customer.pending_count} pending
                        </p>
                    </div>

                    {customer.guests.length === 0 ? (
                        <p className="mt-4 text-black/50">No guests added yet. The customer adds these from their dashboard.</p>
                    ) : (
                        <ul className="mt-4 divide-y divide-black/5">
                            {customer.guests.map((guest) => {
                                const link = inviteLink(guest.token);
                                return (
                                    <li key={guest.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                                        <div>
                                            <p className="font-medium">{guest.name}</p>
                                            {link ? (
                                                <a className="text-sm text-[#0065c8] hover:underline" href={link} target="_blank" rel="noreferrer">
                                                    {link}
                                                </a>
                                            ) : (
                                                <p className="text-sm text-black/40">No link yet</p>
                                            )}
                                        </div>
                                        <span className="text-xs font-semibold uppercase tracking-wide text-black/50">{guest.status}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>

                {/* Danger zone */}
                <section className="mt-8 border border-red-200 bg-white p-6">
                    <h2 className="text-xl font-normal text-red-700">Delete customer</h2>
                    <p className="mt-2 text-sm text-black/60">Permanently removes the account, invitation, and every guest link.</p>
                    <button className="auth-button auth-button-outline mt-4 border-red-300 text-red-700" onClick={remove} type="button">
                        Delete customer
                    </button>
                </section>
            </main>
        </div>
    );
}
