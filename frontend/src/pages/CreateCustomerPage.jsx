import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { WEDDING_TEMPLATES } from '../lib/templates';

const EMPTY = {
    name: '',
    title: '',
    email_local: '',
    slug: '',
    template_slug: 'velvet',
    bride_name: '',
    groom_name: '',
    event_date: '',
    venue: '',
};

export default function CreateCustomerPage() {
    const [form, setForm] = useState(EMPTY);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);

    function updateField(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        setError('');
        setResult(null);

        try {
            const payload = {
                name: form.name,
                title: form.title,
                template_slug: form.template_slug,
            };
            ['email_local', 'slug', 'bride_name', 'groom_name', 'event_date', 'venue'].forEach((field) => {
                if (form[field].trim()) {
                    payload[field] = form[field].trim();
                }
            });

            const data = await api.createCustomer(payload);
            setResult(data);
            setForm(EMPTY);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function copyLogin() {
        const { email } = result.customer.credentials;
        try {
            await navigator.clipboard.writeText(`Email: ${email}\nPassword: ${result.password}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setError('Could not copy automatically. Select and copy the details manually.');
        }
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5] text-black">
            <header className="border-b border-black/10 bg-white px-6 py-5">
                <div className="mx-auto flex max-w-3xl items-center justify-between">
                    <h1 className="text-3xl font-normal">Create customer account</h1>
                    <Link className="auth-button auth-button-outline" to="/admin">
                        Back
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-6 py-10">
                <p className="text-base leading-7 text-black/60">
                    Use this after the customer pays and chooses a template. Send them the generated login, never your admin password. They fill in the rest of the details from their own dashboard.
                </p>

                <form className="mt-8 space-y-5 border border-black/10 bg-white p-6" onSubmit={handleSubmit}>
                    <label className="block">
                        <span className="form-label">Customer name *</span>
                        <input className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black" value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Amina Yacine" required />
                    </label>

                    <label className="block">
                        <span className="form-label">Wedding title *</span>
                        <input className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black" value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Amina & Yacine Wedding" required />
                    </label>

                    <label className="block">
                        <span className="form-label">Login email (optional)</span>
                        <div className="mt-2 flex overflow-hidden border border-black/15">
                            <input className="w-full px-4 py-3 outline-none" value={form.email_local} onChange={(e) => updateField('email_local', e.target.value)} placeholder="amina.yacine" />
                            <span className="flex items-center bg-[#fafaf8] px-4 text-sm text-black/50">@platform.com</span>
                        </div>
                        <p className="mt-2 text-sm text-black/50">Leave blank to auto-generate. Duplicates get a number appended automatically.</p>
                    </label>

                    <label className="block">
                        <span className="form-label">Template *</span>
                        <select className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black" value={form.template_slug} onChange={(e) => updateField('template_slug', e.target.value)}>
                            {WEDDING_TEMPLATES.map((t) => (
                                <option key={t.slug} value={t.slug}>
                                    {t.name} · {t.tagline}
                                </option>
                            ))}
                        </select>
                        <p className="mt-2 text-sm text-black/50">The couple choose their language(s) from their own dashboard.</p>
                    </label>

                    <details className="border-t border-black/10 pt-4">
                        <summary className="cursor-pointer text-sm font-medium text-black/70">Optional details (the customer can fill these in too)</summary>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                                <input className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black" type="date" value={form.event_date} onChange={(e) => updateField('event_date', e.target.value)} />
                            </label>
                            <label className="block">
                                <span className="form-label">Venue</span>
                                <input className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black" value={form.venue} onChange={(e) => updateField('venue', e.target.value)} />
                            </label>
                            <label className="block sm:col-span-2">
                                <span className="form-label">URL slug</span>
                                <input className="mt-2 w-full border border-black/15 px-4 py-3 outline-none focus:border-black" value={form.slug} onChange={(e) => updateField('slug', e.target.value)} placeholder="amina-yacine" />
                                <p className="mt-2 text-sm text-black/50">Auto-generated from the title if left blank.</p>
                            </label>
                        </div>
                    </details>

                    {error ? <p className="text-sm text-red-600">{error}</p> : null}

                    <button className="auth-button auth-button-fill" type="submit" disabled={submitting}>
                        {submitting ? 'Creating...' : 'Create account'}
                    </button>
                </form>

                {result ? (
                    <div className="mt-8 border border-[#0f7a44]/30 bg-white p-6">
                        <h2 className="text-lg font-medium text-[#6b4a34]">Send these login details to the customer</h2>
                        <dl className="mt-4 space-y-3 text-base">
                            <div>
                                <dt className="text-black/50">Email</dt>
                                <dd className="font-semibold">{result.customer.credentials.email}</dd>
                            </div>
                            <div>
                                <dt className="text-black/50">Password</dt>
                                <dd className="font-mono text-lg">{result.password}</dd>
                            </div>
                        </dl>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <button className="auth-button auth-button-fill" type="button" onClick={copyLogin}>
                                {copied ? 'Copied!' : 'Copy login'}
                            </button>
                            <Link className="auth-button auth-button-outline" to={`/admin/customers/${result.customer.id}`}>
                                Manage customer
                            </Link>
                        </div>
                        <p className="mt-4 text-sm text-black/60">You can re-read this password anytime from the customer's page.</p>
                    </div>
                ) : null}
            </main>
        </div>
    );
}
