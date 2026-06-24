import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { resolveInvitationToken, resolveTemplateSlug } from '../lib/resolveInvitation';
import { resolveLocale, offeredLocales, pickLocalized } from '../lib/locales';
import { supportedLocalesFor, defaultLocaleFor } from '../lib/templates';
import PhoneFramePreview from '../components/invitation/PhoneFramePreview';
import LoadingScreen from '../components/LoadingScreen';

// Each template is its own chunk, so a guest only downloads the one they were
// sent, crucially, three.js (the Velvet curtain engine) never ships to anyone
// opening a Sage, Azure, Roseraie or Ivoire invitation.
const VelvetInvitation = lazy(() => import('../templates/velvet/VelvetInvitation'));
const SageInvitation = lazy(() => import('../templates/sage/SageInvitation'));
const AzureInvitation = lazy(() => import('../templates/azure/AzureInvitation'));
const RoseraieInvitation = lazy(() => import('../templates/roseraie/RoseraieInvitation'));
const IvoireInvitation = lazy(() => import('../templates/ivoire/IvoireInvitation'));

const TEMPLATE_VIEWS = {
    velvet: VelvetInvitation,
    sage: SageInvitation,
    azure: AzureInvitation,
    roseraie: RoseraieInvitation,
    ivoire: IvoireInvitation,
};

export default function InvitationPage() {
    const { token } = useParams();
    const [data, setData] = useState(null);
    const [templateSlug, setTemplateSlug] = useState('velvet');
    const [locale, setLocale] = useState('en');
    const [isDemo, setIsDemo] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // `?frame=raw` means we are *inside* the phone iframe, render the template
    // directly and never nest another frame.
    const isRaw = useMemo(
        () => new URLSearchParams(window.location.search).get('frame') === 'raw',
        [],
    );

    // `?lang=` is a *preview-only* override for the gallery demos, so the owner
    // can spot-check a template in each language. Real invitations ignore it:
    // their language is the couple's saved choice, baked in-never guest-toggled.
    const langParam = useMemo(
        () => new URLSearchParams(window.location.search).get('lang'),
        [],
    );
    const [isWide, setIsWide] = useState(
        () => typeof window !== 'undefined' && window.matchMedia('(min-width: 480px)').matches,
    );

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 480px)');
        const onChange = (event) => setIsWide(event.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    const showFrame = isWide && !isRaw;

    useEffect(() => {
        if (showFrame) return; // the iframe loads its own copy; skip the outer fetch.

        const context = resolveInvitationToken(token);

        if (context.isDemo) {
            setIsDemo(true);
            setTemplateSlug(context.templateSlug);
            setLocale(resolveLocale(
                langParam,
                supportedLocalesFor(context.templateSlug),
                defaultLocaleFor(context.templateSlug),
            ));
            setData(context.data);
            setLoading(false);
            return;
        }

        setIsDemo(false);
        setLoading(true);
        setError('');

        api.getInvitation(context.apiToken)
            .then((payload) => {
                const slug = resolveTemplateSlug(payload.wedding.template_slug, null);
                // A guest link may request a language via `?lang=`, but only one
                // the couple actually offers (and wrote content for); otherwise it
                // falls back to their primary. This is how one link is shared in a
                // chosen language without any switcher inside the invitation.
                const offered = offeredLocales(payload.wedding, supportedLocalesFor(slug));
                setData(payload);
                setTemplateSlug(slug);
                setLocale(resolveLocale(
                    langParam ?? payload.wedding.locale,
                    offered,
                    payload.wedding.locale ?? defaultLocaleFor(slug),
                ));
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token, showFrame, langParam]);

    async function handleRsvp(status) {
        const result = await api.submitRsvp(token, status);
        setData((current) => ({
            ...current,
            guest: { ...current.guest, rsvp_status: result.guest.rsvp_status },
        }));
    }

    // Large screen: present the invitation at true phone size inside a device
    // frame, with the warning. (Decided before the loading/error gates so the
    // frame appears instantly, the iframe handles its own loading.)
    if (showFrame) {
        return <PhoneFramePreview />;
    }

    if (loading) {
        return <LoadingScreen variant="invitation" />;
    }

    if (error || !data) {
        return (
            <div className="invitation-root flex min-h-svh items-center justify-center px-6 text-center">
                <p className="font-serif text-lg text-[#8b4a5c]">{error || 'Invitation not found.'}</p>
            </div>
        );
    }

    const TemplateView = TEMPLATE_VIEWS[templateSlug] ?? VelvetInvitation;

    // Show the couple's message in the resolved language (they author one per
    // offered language); fall back to the plain primary-language message.
    const localizedData = {
        ...data,
        wedding: {
            ...data.wedding,
            message: pickLocalized(data.wedding.messages, locale, data.wedding.message),
        },
    };

    return (
        <Suspense fallback={<LoadingScreen variant="invitation" />}>
            <TemplateView data={localizedData} isDemo={isDemo} onRsvp={handleRsvp} locale={locale} />
        </Suspense>
    );
}
