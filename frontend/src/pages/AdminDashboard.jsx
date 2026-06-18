import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { TEMPLATE_BY_SLUG } from '../lib/templates';

function Badge({ tone, children }) {
    const tones = {
        green: 'bg-[#eaf5ee] text-[#0f7a44]',
        amber: 'bg-[#fbf3e6] text-[#9a6b1f]',
        grey: 'bg-[#f0efeb] text-[#6b5d4d]',
    };

    return (
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${tones[tone] ?? tones.grey}`}>
            {children}
        </span>
    );
}

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [summary, setSummary] = useState({ customers: 0, paid: 0, published: 0, accepted: 0, pending: 0 });
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.adminCustomers()
            .then((data) => {
                setCustomers(data.customers);
                setSummary(data.summary);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) {
            return customers;
        }

        return customers.filter((c) =>
            [c.title, c.credentials?.name, c.credentials?.email]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(q)),
        );
    }, [customers, query]);

    return (
        <div className="min-h-screen bg-[#f7f7f5] text-black">
            <header className="border-b border-black/10 bg-white px-6 py-5">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
                    <h1 className="text-3xl font-normal">Customers</h1>
                    <div className="flex items-center gap-3">
                        <span className="hidden text-sm text-black/60 sm:inline">{user.email}</span>
                        <Link className="auth-button auth-button-fill" to="/admin/customers/new">
                            Create customer
                        </Link>
                        <button className="auth-button auth-button-outline" onClick={logout}>
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-10">
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {[
                        ['Customers', summary.customers, 'text-black'],
                        ['Paid', summary.paid, 'text-[#0f7a44]'],
                        ['Published', summary.published, 'text-[#0065c8]'],
                        ['Accepted', summary.accepted, 'text-[#0f7a44]'],
                        ['Pending', summary.pending, 'text-[#6b5d4d]'],
                    ].map(([label, value, color]) => (
                        <div key={label} className="border border-black/10 bg-white p-5">
                            <p className="text-xs uppercase tracking-wider text-black/40">{label}</p>
                            <p className={`mt-2 text-3xl font-semibold ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                    <input
                        className="w-full max-w-sm border border-black/15 px-4 py-3 outline-none focus:border-black"
                        placeholder="Search by couple, wedding, or login email"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {loading ? <p className="mt-8 text-black/50">Loading customers...</p> : null}
                {error ? <p className="mt-8 text-red-600">{error}</p> : null}

                {!loading && !error ? (
                    <div className="mt-6 overflow-x-auto border border-black/10 bg-white">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="border-b border-black/10 bg-[#fafaf8] text-[#6b5d4d]">
                                <tr>
                                    <th className="px-5 py-4">Customer</th>
                                    <th className="px-5 py-4">Wedding</th>
                                    <th className="px-5 py-4">Template</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">RSVPs</th>
                                    <th className="px-5 py-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td className="px-5 py-10 text-center text-black/50" colSpan={6}>
                                            {customers.length === 0
                                                ? 'No customers yet. Create your first customer to get started.'
                                                : 'No customers match your search.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((c) => (
                                        <tr key={c.id} className="border-t border-black/5 align-top">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold">{c.credentials?.name}</p>
                                                <p className="mt-1 text-black/50">{c.credentials?.email}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p>{c.title}</p>
                                                <p className="mt-1 text-black/50">{c.event_date ?? 'No date set'}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                {TEMPLATE_BY_SLUG[c.template_slug]?.name ?? c.template_slug}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col items-start gap-2">
                                                    <Badge tone={c.published ? 'green' : 'grey'}>
                                                        {c.published ? 'Published' : 'Draft'}
                                                    </Badge>
                                                    <Badge tone={c.paid ? 'green' : 'amber'}>
                                                        {c.paid ? 'Paid' : 'Unpaid'}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="text-[#0f7a44]">{c.accepted_count} accepted</p>
                                                <p className="text-black/50">{c.pending_count} pending</p>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <Link className="text-[#0065c8] hover:underline" to={`/admin/customers/${c.id}`}>
                                                    Manage
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </main>
        </div>
    );
}
