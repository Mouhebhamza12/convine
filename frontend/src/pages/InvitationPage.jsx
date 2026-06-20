import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { resolveInvitationToken, resolveTemplateSlug } from '../lib/resolveInvitation';
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
    const [isDemo, setIsDemo] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // `?frame=raw` means we are *inside* the phone iframe, render the template
    // directly and never nest another frame.
    const isRaw = useMemo(
        () => new URLSearchParams(window.location.search).get('frame') === 'raw',
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
            setData(context.data);
            setLoading(false);
            return;
        }

        setIsDemo(false);
        setLoading(true);
        setError('');

        api.getInvitation(context.apiToken)
            .then((payload) => {
                setData(payload);
                setTemplateSlug(resolveTemplateSlug(payload.wedding.template_slug, null));
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token, showFrame]);

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

    return (
        <Suspense fallback={<LoadingScreen variant="invitation" />}>
            <TemplateView data={data} isDemo={isDemo} onRsvp={handleRsvp} />
        </Suspense>
    );
}
